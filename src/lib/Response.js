export class Response{
    success(res, message, body, statusCode){
        res.status(statusCode || 200).send({
            success : true,
            messages : [message],
            code : ["0000"],
            data : body
        })
    }

    error(res, message, statusCode){
        res.status(statusCode || 500).send({
            success : false,
            messages : message,
            code : ["5000"],
            data : []
        })
    }   
}