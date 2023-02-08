const bcryptjs = require('bcryptjs')
const express = require('express')
const app = express()
const port = 3000

const users = require("./users");

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/usuarios', async (req, res) => {
  const usersBD = await users.getUsers();
  res.send(usersBD);
})

app.get('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const userDB = await users.getUser(id);


  if(!userDB){
    return res.status(404).json({
      msg:`No existe usuario con id ${id}`
    });
  }

  res.json(userDB);
})

app.post('/usuarios', async (req, res) => {
  console.log(req.body);
const {username, password} = req.body;

if(!username){
  return res.status(400).json({
    msg:"Debe enbiar el username",
    field:"username"
  })
}
if(!password){
  return res.status(400).json({
    msg:"Debe enbiar el password",
    field:"password"
  })
}

//encriptar pasword
const salt = bcryptjs.genSaltSync()
const hash = bcryptjs.hashSync(password,salt)
try {
  const {password:_password,...user} = await users.addUser(username,hash);
  res.status(200).json({user});

} catch (error) {
    res.status(400).json({
      msg:error.message
    })
}
  
})


app.patch('/usuarios', async (req, res) => {
  const { username, score } = req.body;

  if (!username) {
    return res.status(400).json({
      msg: "Debe enviar el username",
      field: "username"
    });
  }
  if (!score) {
    return res.status(400).json({
      msg: "Debe enviar el score",
      field: "score"
    });
  }

  try {
    const user = await users.updateUserScore(username, score);
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({
      msg: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})