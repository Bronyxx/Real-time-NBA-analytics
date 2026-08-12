const prisma= require("../config/prisma.js")


const createNotification=async(data)=>{
    return prisma.Notification.create({
        data:data,
    });
}

const getNotification=async(page,limit)=>{
    return prisma.Notification.findMany({
        skip:(page-1)*limit,
        take:limit,
        orderBy:{
            createdAt:"desc",
        }
    });
}
module.exports={createNotification,getNotification}