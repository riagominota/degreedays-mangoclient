/**
 * Date: 2/1/23 - DD/MM/YYYY
 * Author: Matt 'Fox' Fox
 * Description: Logs into mango, and fires data into system for a given datapoint.
 * Call the file by running `node ddMango.js --xid=... --user=... --pass=...` - ideal for evented calls
 * Optionally, host and port can be added if not localhost or 8080 etc.
 */

const process = require('process');
const  MangoClient  = require('mango-client');

const REQ_ARG_LIST = ["xid","user","pass"];
const ARG_LIST = ["bearer","host","port"]; // A bearer token can be used instead if desired

let ARG_VALS = {xid:"",user:"",pass:"",bearer:"",host:"localhost",port:8080};


// Args are provided in the form of --xid=... --user=... --pass=...
//This means we can call this from mango itself
const hasArgVal = key => {
    // Return true if the key exists and a value is defined
    for( let str of process.argv)
        if ( str.includes( `--${ key }` ) ) return true;

    return false;
}

const getArgVal = arg => {

    let val = null;
    if( hasArgVal(arg) ){
      val = process.argv.find( element => element.startsWith( `--${arg}=` ) );
      val = val.replace( `--${arg}=` , '' );
    }

    // Return null if the key does not exist and a value is not defined
    return val;
}

/**
 * Ensure all args are properly populated before firing the script...
 */
const VerifyArgs = () =>{
    for(let k in ARG_LIST)
    {
        if( hasArgVal(ARG_LIST[k]) )
        {
            ARG_VALS[ ARG_LIST[k] ] = getArgVal(ARG_LIST[k]);
        }
    }

    for(let k in REQ_ARG_LIST)
    {
        if( hasArgVal(REQ_ARG_LIST[k]) )
        {
            ARG_VALS[ REQ_ARG_LIST[k] ] = getArgVal(REQ_ARG_LIST[k]);
        }
        else
        {
            if(REQ_ARG_LIST[k]=="pass" && ARG_VALS.bearer!==""){continue;}

            console.log(`ERROR: argument --${REQ_ARG_LIST[k]} has not been passed as an argument to this script. Exiting.`);
            process.exit(1);
        }
    }
}


VerifyArgs();


// Get degree days data here... then let's send it to mango.
// You will need to parse the date into a timestamp using luxon
let degreeDaysValue = "2022-12-26: 42.70".split(": "); // creates an array - [0] is our timestamp, [1] is our value

const MangoClientInstance = new MangoClient({...ARG_VALS});
if(ARG_VALS.bearer!=="")
    MangoClientInstance.setBearerAuthentication(ARG_VALS.user,ARG_VALS.bearer);
else
    MangoClientInstance.setBasicAuthentication(ARG_VALS.user,ARG_VALS.pass);


/*
    * Save point values Array of:
    *  {xid,value,dataType,timestamp,annotation}
    */
const insertValuesV4 = (xid,values) => {
    return MangoClientInstance.restRequest({
        path: `/rest/latest/point-values/${xid}`,
        method: 'PUT',
        data: values
    }).then(response => {
        return response.data;
    });
}


//FIRE!!!
insertValuesV4(ARG_VALS.xid,
        {
            value:degreeDaysValue[1],
            dataType:"NUMERIC"
        //timestamp: epoch timestamp should work.... use from the day in question in your code
        }
);

