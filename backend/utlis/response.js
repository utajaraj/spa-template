module.exports={
    respond:(status,message="",data=[],error="")=>{
        if (status==undefined) {
            throw "Status must be declared for there to be an appropriate response"
        }
        return {status,message,data,error}
    }
}