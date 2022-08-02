
const needle = require('needle')
const jsonfile = require('jsonfile')
const fs = require("fs")
const config = require('dotenv').config()
const TOKEN = process.env.TWITTER_BEARER_TOKEN



const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const streamURL =
  'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id'


const rules = [{ value: '#fashion' }]

// Get stream rules
async function getRules() {
  const response = await needle('get', rulesURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })
  console.log(response.body)
  return response.body
}



// Set stream rules

async function setRules() {
  const data = {
    add: rules,
  }

  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  return response.body
}

// Delete stream rules

async function deleteRules(rules) {
  if (!Array.isArray(rules.data)) {
    return null
  }

  const ids = rules.data.map((rule) => rule.id)

  const data = {
    delete: {
      ids: ids,
    },
  }

  const response = await needle('post', rulesURL, data, {
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  return response.body
}
  function  streamTweets() {
  
    const stream = needle.get(streamURL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

 const arr=[]

  stream.on('data', (data) => {
    try
     {

        fs.appendFile('fashion.csv',data,function(err){
          if(err) throw err;
          console.log('saved');
        });

    } catch (error) {}
  })


  console.log(arr.length);

};
(async()=>{
    let currentRules

    try{
        currentRules=await getRules()

        await deleteRules(currentRules)

        await setRules();
    }catch(error){
        console.log(error)
        process.exit(1)
    }
    streamTweets();
})();






