const {getNotification}= require("../services/notificationService.js")



const notificationController=async(req,res)=>{
    const page= Number(req.query.page) || 1
    const limit= Number(req.query.limit)|| 20
    try{
    const notifications = await getNotification(page,limit);
     res.status(200).json({
        sucess:"true",
        data:notifications

     })
}
catch(err){
    console.error(err);
    res.status(500).json({
        sucess:"false",
        message:"error in retrieving notifications"
    })
}
}  


module.exports={notificationController}