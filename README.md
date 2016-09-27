Broker Bitbucket-Trello
============ 


Run this at start. It should prompt for each parameter.
```
npm install
npm start
```

Parameters can be found in `parameters.json`

 - `trelloUsername` is your Trello @username

 - `trelloApiKey` can be fetched here (user needs to be logged)

 https://trello.com/1/appKey/generate 

 - `trelloApiToken` here: (_change {{key}} for trelloApiKey_)

 https://trello.com/1/connect?key={{key}}&name=BitbucketBroker&response_type=token&scope=read,write&expiration=never

### How to use it
 - The Trello user specified in parameters has to be added to each board where this is gonna be used
 - Bitbucket webhook should point to the root of this http service
 - Commits messages should contain Trello cardId references, this can be found on the url. For example, for https://trello.com/c/jkNJRGlv/9-test-card-task is `jkNJRGlv`
 - CardId references should be within `[ ]`, can be multiple of them, and can be chained between `,`. For example `[jkNJRGlv] task completed` or `Completed [jkNJRGlv] and [AsajklA,12dfXDF] and [zcvSDF,dfgDFG,adfgSD]`