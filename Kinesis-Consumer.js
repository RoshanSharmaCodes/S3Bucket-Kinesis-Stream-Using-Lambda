
export const handler = async(event) => {
    console.log("Kinesis Says**************************************")
    console.log(event.Records[0].kinesis)
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
