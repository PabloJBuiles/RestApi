const fs = require("fs");

let users = [];

const loadUsersBD = ()=>{

    try {
        users = require("./db/users.json");        
    } catch (error) {   
        users = [];        
    }
}
const saveUserDB=  async ()=>{
    const data = JSON.stringify(users);

    fs.writeFile("db/users.json",data,(err)=>{
        if(err){
            throw new Error("Error guardando el archivo users.json");          
        }
        console.log("Save user ok");
        return;       
    })

}
loadUsersBD();
console.log(users);

const getUsers = async ()=>{
    return users;
}

const getUser = async (id)=>{
    const user = users.find(user=>user.id == id);
    return user;
}
const addUser = async (username,password)=>{
    const user = users.find(user => user.username === username);

    if(user){
        throw new Error(`El nombre usuario ${username} ya esta registrado`);
    }

    let newUser = {
        id: users.length + 1,
        username,
        password,
        score:0
    }

    users.push(newUser);

    await saveUserDB();

    return newUser;
}
const updateUserScore = async (username, score) => {
    let user = users.find(user => user.username === username);
  
    if (!user) {
      throw new Error(`No existe usuario con username ${username}`);
    }
  
    user.score = score;
  
    await saveUserDB();
  
    return user;
  };

 module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUserScore
 }
