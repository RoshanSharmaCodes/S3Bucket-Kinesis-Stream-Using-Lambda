import {S3Client,GetObjectCommand} from "@aws-sdk/client-s3"
import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis"
const s3Client = new S3Client({ region: "ap-southeast-1" });


export const handler = async(event) => {
    var filename = event.Records[0].s3.object.key
    var bucketName = event.Records[0].s3.bucket.name
    const param = {
        Bucket: bucketName,
        Key: filename
    }
    
    try {
    // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
        const data = await s3Client.send(new GetObjectCommand(param));
    // Convert the ReadableStream to a string.
        const S3data = await data.Body.transformToString()
        const payload = {
            Data: S3data
        }
       await sendToKinesisStream(payload,filename)
        
    } catch (err) {
        console.log("Error", err);
    }
    return true
}

const sendToKinesisStream = async (payload,filename)=>{
    const params = {
        Data: Buffer.from(JSON.stringify(payload)),
        PartitionKey: filename,
        StreamName: "Kinesis-Data-Stream"
    }
    const KinClient = new KinesisClient({region:"ap-southeast-1"})
    try{
        
        const data = await KinClient.send(new PutRecordCommand(params));
        
        const httpsCode = await data.httpStatusCode
        if(httpsCode==200){
            console.log("*********************Stream Gets Executed Successfully*************************")
        }
    }catch(err){
        console.log("Error",err)   
    }
    return true
    
}
