var fs = require('fs');
let ext = '.js';
let pathTable = {};

module.exports = (pathDb) => {
  return new Db({pathDb: pathDb});
}

/**
 * Class manage Database
 */
class Db{
  constructor(config){
    this.pathDb = config.pathDb;

    this.tables = {};

    // check if path is ok, and Load tables of database, if not create it
    try {
      fs.accessSync(this.pathDb, fs.F_OK);

      let files = fs.readdirSync(this.pathDb);
      files.forEach(file => {
        if(!fs.lstatSync(this.pathDb + '/' + file).isDirectory())
          this.tables[file.replace(ext, '')] = createTable(this.pathDb, file.replace(ext, ''));
      });
    } catch (e) {
      throw e;
    }


  }

  /**
   * get table, if not exists, create it
   */
  use(table){
    if(undefined === this.tables[table]){
      this.tables[table] =  createTable(this.pathDb, table);
    }
    return this.tables[table];
  }
}


/**
 * create instance class Table
 * @param  {string} path  Path to table file
 * @param  {string} table name of table
 * @return {Class Table}  return instance of table
 */
function createTable(path, table){
  return new Table(path, table)
}


/**
 * Check if file of database exists
 * If not create it
 * @param  {string} path Path of table to check
 */
function checkPathTable(path){
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    fs.writeFileSync(path, "{}");
  }
}


/**
 * Sort object in order alphabelic on first floor
 * @param  {object} param Object to sort
 * @return {object}       object sorting
 */
function sortObject(param){
  let result = {};
  for(let item of Object.keys(param)){
    result[item] = param[item];
  }
  return result;
}


/**
 * Class table for manage table independently
 */
class Table{
  constructor(path, table){
    this.name = table;
    pathTable[table] = path + '/' + table + ext;
    checkPathTable(pathTable[this.name]);
    this.datas = JSON.parse(fs.readFileSync(pathTable[table]).toString('utf-8'));
    return this;
  }

  /**
   * Find one entry by id
   */
  findById(id){
    if(this.datas[id]){
      return this.datas[id];
    }
    return false;
  }

  last(nb){
    let result = this.list();
    return result.slice(result.length - nb, result.length);
  }

  /**
   * Find only one correspondance
   */
  findOne(param){
    let result = this.find(param);
    if(result.length === 1){
      return result[0];
    }
    return false;
  }

  /**
   * return all table
   */
  list(){
    let result = [];
    for(let key in this.datas){
      result.push(Object.assign({}, this.datas[key], {id: key}));
    }
    return result;
  }

  /**
   * Find several entry by params
   */
  find(param){
    let results = [];
    let data = Object.assign({}, this.datas);

    let paramString = JSON.stringify(sortObject(param)).replace('{', '(').replace('}', ')').replace('","', '").+("');

    for(let key in data){
      let item = data[key];
      let itemString = JSON.stringify(item);
      let reg = new RegExp(paramString, 'g');
      if(reg.test(itemString)){
        results.push(Object.assign({}, item, {id: key}));
      }
    }
    return (results.length) ? results : false;
  }

  /**
   * Delete one entry
   */
  del(id){
    delete this.datas[id];
    return this;
  }

  /**
   * set data by id
   */
  set(id, data){
    if(this.datas[id]){
      if(data.id){
        delete data.id;
      }

      // set data
      this.datas[id] = data;
    }
    else{
      throw 'Table "' + id + '" not exists';
    }
  }

  /**
   * Save file and data
   */
  save(){
    fs.writeFile(pathTable[this.name], JSON.stringify(this.datas));
  }

  /**
   * Create one entry
   */
  push(id, data){
    // set data
    this.datas[id] = data;
    return this;
  }
}
