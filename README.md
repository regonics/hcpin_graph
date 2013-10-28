hcpin_graph
=========  
  
Installation
--------------

```sh
git clone https://github.com/regonics/hcpin_graph 
cd hcpin_graph
sudo yum install nodejs
sudo yum install npm
sudo yum install mongodb mongodb-server
npm install
```

Loading the database
--------------------
```sh
sudo service mongod start
cd parse
node parse.js
```

Run the server
-------------------
```sh
sudo PORT=80 node server.js
```

Example Usage
-------------------

http://ec2-54-211-4-43.compute-1.amazonaws.com/input  
Input: P11473 P27037
