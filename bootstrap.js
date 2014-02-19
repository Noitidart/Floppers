const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	id: 'Floppers',
	suffix: '@jetpack',
	path: 'chrome://floppers/content/',
	aData: 0,
};

const myServices = {};
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');
Cu.import('resource://gre/modules/FileUtils.jsm');
XPCOMUtils.defineLazyGetter(myServices, 'as', function(){ return Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService) });

var dbFile; //im only opening a single database at a time in this addon so no need to support multiple daatabases open at one time
var dbConn;

var dbCache = {
	/*
	table_name: {
		desc: 'description of table'
		head: {
			col1_name: {type:'type', constraints:'constraints', constraints: null, desc:'col1_desc'}
			col2_name: {type:'type', constraints:'constraints', constraints: null, desc:'col2_desc'}
		},
		body: [
			{col1_name: 'col1_value1', col2_name: 'col2_value1'},
			{col1_name: 'col1_value2', col2_name: 'col2_value2'}
		]
	}
	*/
	following: {
		head: {
			//key: {type:'INTEGER', constraints:'PRIMARY KEY', constraints: null, desc:'auto increment id of row'} //everything auto has rowid and if i dont set my own i can use that and it is really fast
			id_str: {type:'TEXT', constraints: null, desc:'twit id of users owner is following'}, //note: owner is defined as person who has this addon installed, thus the person who logged into this app
			time: {type:'INTEGER', constraints: null, desc:'time that this id_str was last seen in the following twit db of owner by flopper script'}
		},
		body: []
	},
	blocked: {
		head: {
			id_str: {type:'TEXT', constraints: null, desc:'twit id of users owner has blocked'}, //note: owner is defined as person who has this addon installed, thus the person who logged into this app
			time: {type:'INTEGER', constraints: null, desc:'time that owner blocked this user'}
		},
		body: []
	},
	history_blocker: {
		head: {
			id_str: {type:'TEXT', constraints: null, desc:'twit id of user that has blocked owner'}, //note: owner is defined as person who has this addon installed, thus the person who logged into this app
			time: {type:'INTEGER', constraints: null, desc:'time that flopper script first detected block'}
		},
		body: []	
	}
	history_follower: {
		head: {
			id_str: {type:'TEXT', constraints: null, desc:'twit id of user that is following owner'}, //note: owner is defined as person who has this addon installed, thus the person who logged into this app
			time: {type:'INTEGER', constraints: null, desc:'time that this id_str was last seen in the follower twit db of owner by flopper script'}
		},
		body: []
	},
	history_friend: {
		head: {
			id_str: {type:'TEXT', constraints: null, desc:'twit id of user that is friends with owner'}, //note: owner is defined as person who has this addon installed, thus the person who logged into this app
			time: {type:'INTEGER', constraints: null, desc:'time that this id_str was last seen in the friend twit db of owner by flopper script'}
		},
		body: []
	},
	history_topic: {
		head: {
			id: {type:'TEXT', constraints: null, desc:'id of tweet of owner'},
			id_str: {type:'TEXT', constraints: null, desc:'twit id of user that did the fave/unfave of topic_id'}, //note: owner is defined as person who has this addon installed, thus the person who logged into this app
			faved: {type:'TINYINT', constraints: null, desc:'0 for unfaved 1 for faved'},
			time: {type:'INTEGER', constraints: null, desc:'time that this id_str was last seen in the friend twit db of owner by flopper script'}
		},
		body: []
	},
	last_visit: {
		head: {
			time: {type:'INTEGER', constraints: null, desc:'time last visited the floppers front end'}
		}
		body: []
	}
};

//start - library sqlite function
/* //commented this out because i learned you dont have to define each column name that you want to insert to, if you skip it, it gets set to default value
function insert(table, colToVal, callbacks) {
	//table is string
	//colToVal is array of objects [{col1_name:'value1'},{col1_name:'value2'}]
	////if table has col2_name and was not found in colToVal[i] its ok it will insert it as default value note: (RIGHT NOW ITS NULL)
	//create properly ordered insert object
	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}
	
	var invalidHeadersFound = false;
	var orderedInsert = [];
		
	for (var i=0; i<colToVal.length; i++) {	
		var thisOrderedInsert = {};
		for (var h in dbCache[table].head) {
			thisOrderedInsert[h] = colToVal[i][h] ? colToVal[i][h] : 'NULL'; //note: it should not be null but its default value as defined on table creation
			delete colToVal[i][h];
		}
		for (var h in colToVal[i]) {
			Cu.reportError('error! h of "' + h + '" found in colToVal['+i+'] but is NOT in table head, will abort');
			invalidHeadersFound = true;
		}
		if (invalidHeadersFound) {
			return;
		} else {
			orderedInsert.push(thisOrderedInsert);
		}
	}
	
	var orderedInsertStr = [];
	for (var i=0; i<orderedInsert.length; i++) {
		var thisOrderedInsertStr = [];
		for (var h in orderedInsert[i]) {
			thisOrderedInsertStr.push(orderedInsert[i][h]);
		}
		thisOrderedInsertStr = '"' + thisOrderedInsertStr.join('","') + '"';
		orderedInsertStr.push(thisOrderedInsertStr);
	}
	orderedInsertStr = orderedInsertStr.join(',');
	
	var insertStatement = dbConn.createStatement('INSERT INTO ' + table + ' VALUES(' + orderedInsertStr + ')');
	insertStatement.executeAsync({
		handleCompletion: function (aReason) {
			if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
				Cu.reportError('insertStatement Query canceled or aborted!');
			}
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
		},
		handleError: function(aError) {
			Cu.reportError('insertStatement Error: ' + aError.message);
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
		}
	});
}
*/

function insert(table, colToVal, callbacks) {
	//table is string
	//colToVal is array of objects this is wrong: [{col1_name:'value1'},{col1_name:'value2'},{col2_name:'value3'}]
	//wrong because val[0] and val[1] has col1 BUT val[3] does not, each val[i] must have same col names
	
	
	////if table has col2_name and was not found in colToVal[i] its ok it will insert it as default value note: (RIGHT NOW ITS NULL)
	//create properly ordered insert object
	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}
	
	var invalidHeadersFound = false;
	var orderedInsert = [];
	var colNamesStr = [];

	var dupeChecking = [];
	for (var i=0; i<colToVal.length; i++) {	 //block checks all col names are in dbCache head. then checks that all array values have all the same columns
		dupeChecking = [];
		for (var h in colToVal[i]) {
			if (!(h in dbCache[table].head)) {
				Cu.reportError('error! h of "' + h + '" found in colToVal['+i+'] but is NOT in table head, will abort');
				return;
			}
			if (i == 0) {
				if (colNameStr.indexOf(h) == -1) {
					colNameStr.push(h);
				} else {
					Cu.reportError('column h "' + h + '" defined twice in one insert val where i = ' + i + '.... aborted');
					return;
				}
			} else {
				if (dupeChecking.indexOf(h) > -1) {
					Cu.reportError('column h "' + h + '" defined twice in one insert val where i = ' + i + '.... aborted');
					return;
				}
				dupeChecking.push(h);
				//checks if i after 0 vals have more col_name dupes
				if (colNameStr.indexOf(h) == -1) {
					Cu.reportError('column h "' + h + '" defined in val of "' + i + '" but it it is not in val[0].... aborted');
					return;
				}
			}
		}
	}
	
	for (var i=0; i<colToVal.length; i++) { //turns to insert str
		var thisOrderedInsert = {};
		for (var j=0; j<colNamesStr.length; j++) {
			var colName = colNamesStr[j];
			thisOrderedInsert[colName] = colToVal[i][colName] : 
		}
		orderedInsert.push(thisOrderedInsert);
	}
	//now orderedInsert is an array of obj
	
	var orderedInsertStr = [];
	for (var i=0; i<orderedInsert.length; i++) { //combines the objs in orderedInsert into str
		var thisOrderedInsertStr = [];
		for (var h in orderedInsert[i]) {
			thisOrderedInsertStr.push(orderedInsert[i][h]);
		}
		thisOrderedInsertStr = '("' + thisOrderedInsertStr.join('","') + '")';
		orderedInsertStr.push(thisOrderedInsertStr);
	}
	orderedInsertStr = orderedInsertStr.join(',');
	Cu.reportError('see if this is correct: -----' + 'INSERT INTO ' + table + '(' + colNamesStr.join(',') + ') VALUES' + orderedInsertStr + '----');
	return; //note: debug
	var insertStatement = dbConn.createStatement('INSERT INTO ' + table + '(' + colNamesStr.join(',') + ') VALUES' + orderedInsertStr);
	insertStatement.executeAsync({
		handleCompletion: function (aReason) {
			if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
				Cu.reportError('insertStatement Query canceled or aborted!');
			}
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
		},
		handleError: function(aError) {
			Cu.reportError('insertStatement Error: ' + aError.message);
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
		}
	});
}

function select(table, selects, where, callbacks) {
	//table is string
	//where is obj
	////ie: {id:'>5',user:'="noit"'}
	//selects is array
	//ie: ['body','userid']
	
	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}
	var whereStr = [];
	for (var h in where) {
		if (!(h in dbCache[table].head)) {
			Cu.reportError('error: h of "' + h + '" found in where obj but is not in table head. aborting');
			return;
		} else {
			whereStr.push(h + where[h]);
		}
	}
	whereStr = ' WHERE ' + whereStr.join(',');
	
	var selectsStr = [];
	for (var i=0; i<selects.length; i++) {
		if (selects[i] in dbCache[table].head) {
			selectsStr.push(selects[i]);
		} else {
			Cu.reportError('error: h of "' + h + '" found in selects arr but is not in table head. aborting');
			return;
		}
	}
	selectsStr = selectsStr.join(',');
	
    var selectStatement = dbConn.createStatement('SELECT ' + selectsStr + ' FROM ' + table + whereStr);
    selectStatement.executeAsync({
        handleResult: function(aResultSet) {
            //let row = aResultSet.getNextRow();
            //body.innerHTML = row.getResultByName('body');
			if (callbacks.handleResult instanceof Function) {
				callbacks.handleResult(aResultSet);
			}
        },
        handleError: function (aError) {
    		Cu.reportError('selectStatement Error: ' + aError.message);
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
    	},
    	handleCompletion: function (aReason) {
			if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
				Cu.reportError('selectStatement Query canceled or aborted!');
			}
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
		}
    });
}

function update(table, updates, where, callbacks) {
	//table is string
	//where is obj
	////ie: {id:'>5',user:'="noit"'}
	//updates is obj
	//ie: {time:'5454'}
	
	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}

	var whereStr = [];
	for (var h in where) {
		if (!(h in dbCache[table].head)) {
			Cu.reportError('error: h of "' + h + '" found in where obj but is not in table head. aborting');
			return;
		} else {
			whereStr.push(h + where[h]);
		}
	}
	whereStr = ' WHERE ' + whereStr.join(',');
	
	var updatesStr = [];
	for (var h in updates) {
		if (!(h in dbCache[table].head)) {
			Cu.reportError('error: h of "' + h + '" found in updates obj but is not in table head. aborting');
			return;
		} else {
			updatesStr.push(h + '="' updates[h] + '"');
		}
	}
	updatesStr = updatesStr.join(',');
	
    var updateStatement = dbConn.createStatement('UPDATE ' + table + ' SET ' + updatesStr + whereStr);
    updateStatement.executeAsync({
        handleError: function (aError) {
    		Cu.reportError('updateStatement Error: ' + aError.message);
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
    	},
    	handleCompletion: function (aReason) {
			if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
				Cu.reportError('updateStatement Query canceled or aborted!');
			}
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
		}
    });
}

function fetchTable(table, callbacks) {
	//clears body array of table in dbCache and puts new fetch there
	//only accepts handleCompletion and handleError for callbacks
	
	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}
	
	var callbacksForSelect = {
		handleResult: function(aResultSet) {
			var rowStructure = tableStructure.slice(0); //this depends on the select statement of s320669; since it matches tableStructure im just splicing
			for (let row = aResultSet.getNextRow(); row; row = aResultSet.getNextRow()) {
				var thisRow = {};
				/* for (var h in dbCache[table].head) {
					thisRow[h] = row.getResultByName(rowStructure[i]);
				} */
				for (var i=0; i<rowStructure.length; i++) {
					thisRow[rowStructure[i]] = row.getResultByName(rowStructure[i]);
				}
				dbCache[table].body.push(thisRow);
			}
			Cu.reportError('tableFetch - handleResult finned');
		},
		handleCompletion: function(aReason) {
			//note: todo: figure out if this fires after handleResult function finishes
			Cu.reportError('tableFetch - handleCompletion fired');
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
		},
		handleError: function(aError) {
			Cu.reportError('tableFetch - in aError');
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
		}
	}
	
	select(table, '*', [], callbacksForSelect);
}

/*
//note: how to get last autoincrement inserted id: http://alvinalexander.com/android/sqlite-autoincrement-insert-value-primary-key
*/

function deleteRows(table, where, callbacks) {
	//note: if want to empty table and restart autoincrement id, then have to drop then recreate table
	//where is obj
	////ie: {id:'>5',user:'="noit"'}

	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}
	
	var whereStr = [];
	for (var h in where) {
		if (!(h in dbCache[table].head)) {
			Cu.reportError('error: h of "' + h + '" found in where obj but is not in table head. aborting');
			return;
		} else {
			whereStr.push(h + where[h]);
		}
	}
	if (whereStr.length > 0) {
		whereStr = ' WHERE ' + whereStr.join(',');
	} else {
		whereStr = '';
	}
	
    let deleteStatement = dbConn.createStatement('DELETE FROM ' table + whereStr);
    deleteStatement.executeAsync({
    	handleError: function (aError) {
    		Cu.reportError('deleteStatement Error: ' + aError.message);
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('deleteStatement Query canceled or aborted!');
    		} else {
                Cu.reportError('deleteStatement completed succesfully: ' + aReason);
    		}
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
    	}
    });
}
}

function dropTable(table, callbacks) {
	//http://alvinalexander.com/android/sqlite-drop-table-syntax-examples
	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}
	
    var dropStatement = dbConn.createStatement('DROP TABLE IF EXISTS ' + table);
    dropStatement.executeAsync({
    	handleError: function (aError) {
    		Cu.reportError('dropStatement Error: ' + aError.message);
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('dropStatement Query canceled or aborted!');
    		} else {
                Cu.reportError('dropStatement completed succesfully: ' + aReason);
    		}
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
    	}
    });
}

function deleteDatabase() {
	//http://alvinalexander.com/android/sqlite-drop-database-how
	//"DROP DATABASE" does not seem meaningful for an embedded database engine like SQLite. To create a new database, just do sqlite_open(). To drop a database, delete the file.
	//just delete the file
	
	//im just guessing this is how to do it:
    dbConn.asyncClose({
		complete: function() {
			Cu.reportError('SUCCESFULLY CLOSED dbConn');
			dbFile.remove();
			
			/*///should probably listen for exceptions here
				Exceptions thrown
				NS_ERROR_FILE_TARGET_DOES_NOT_EXIST
					Indicates that the current file path does not exist. It is not possible to remove a file that does not exist.
				NS_ERROR_FILE_DIR_NOT_EMPTY
					Indicates that an attempt was made to remove a directory that is not empty.
				NS_ERROR_FILE_ACCESS_DENIED
					Indicates that an attempt was made to remove a file in a way that exceeded your permissions. Details depend on your file system and how its permissions work. 
			*/////
		}
	});
}

function openDatabase(dbName) {
    dbFile = FileUtils.getFile('ProfD', [dbName + '.sqlite']);
    dbConn = Services.storage.openDatabase(dbFile); // Will also create the file if it does not exist
}

function closeDatabase(dbName) {
    dbConn.asyncClose({
		complete: function() {
			Cu.reportError('SUCCESFULLY CLOSED dbConn');
		}
	});
}

function createTable(table, callbacks) {
	//follows structure setup in dbCache
	//creates table if not exists
	//technique to test if table exists via create table:
	////reun the create table if not exists query, if no errors, and no success, then run "create table" if it errors then it means it exists
	
	if (!(table in dbCache)) {
		Cu.reportError('ERROR: table not found in dbCache');
		return;
	}
	
	var headers = [];
	for (var h in dbCache[table].head) {
		var header = h + ' ' + dbCache[table].head[h].type;
		if (dbCache[table].head[h].constraints) {
			header +=  ' ' + dbCache[table].head[h].constraints;
		}
		headers.push(header);
	}
	
	headers = headers.join(',');
	
    var createtableStatement = dbConn.createStatement('CREATE TABLE IF NOT EXISTS ' + table + ' (' + headers + ');');
    createtableStatement.executeAsync({
    	handleError: function (aError) {
    		Cu.reportError('createtableStatement Error: ' + aError.message);
			if (callbacks.handleError instanceof Function) {
				callbacks.handleError(aError);
			}
    	},
    	handleCompletion: function (aReason) {
    		if (aReason != Ci.mozIStorageStatementCallback.REASON_FINISHED) {
        	    Cu.reportError('createtableStatement Query canceled or aborted!');
    		} else {
                Cu.reportError('createtableStatement completed succesfully: ' + aReason);
    		}
			if (callbacks.handleCompletion instanceof Function) {
				callbacks.handleCompletion(aReason);
			}
    	}
    });
}
//end - library sqlite function

function startup(aData, aReason) {
	self.aData = aData;
	
	//check currently logged in user and open database accordingly
	createDatabase('floppers');
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	
	closeDatabase();
}

function install() {}

function uninstall() {}