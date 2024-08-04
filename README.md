# AWS Cognito Demos

AWS Cognito Demos

## Article
https://hexquote.com/aws-cognito-basics-user-pools/    
https://hexquote.com/aws-cognito-web-application-integration-basics/    
https://hexquote.com/aws-cognito-and-web-applications-protecting-and-accessing-apis-javascript-and-net-core/    

## Deployed App:
https://cognito.awsclouddemos.com/    


## Steps

`npm install`    
`npm run dev`    
`npm run build`    
`aws s3 sync . s3://cognito.awsclouddemos.com --acl public-read ` (run from inside dist folder)    
