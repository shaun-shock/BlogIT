import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

const myBlogs = [];
const myTitles = [];
const indices = [];



app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));


app.get("/",(req,res)=>{
    res.render("\index.ejs");
});


app.get("/explore",(req,res)=>{
    res.render( "\explore.ejs", {title: titles, content: data});

});

app.get("/blog",(req,res)=>{
    res.render( "blogRead.ejs", {title: titles, content: data});

});

app.get("/create",(req,res)=>{
    res.render( "create.ejs", {title: titles, content: data});

});


app.get("/my-blogs",(req,res)=>{
    res.render( "\my-blogs.ejs", {title: myTitles, content: myBlogs});

});

app.post("/create",(req,res, body)=>{
    var newTitle = req.body.blogTitle;
    var newBlog = req.body.blogContent;
    myBlogs.push(newBlog);
    myTitles.push(newTitle);
    indices.push(titles.length);
    titles.push(newTitle);
    data.push(newBlog);

    res.render( "create.ejs", {title: titles, content: data});

});


app.get('/blog/:index', (req, res) => {
    const index = req.params.index; 
    const title = titles[index];
    const blog = data[index]; 
    res.render('blogRead.ejs', { title: title, content: blog });
  })

  app.get('/my-blog/:index', (req, res) => {
    const index = req.params.index; 
    const title = myTitles[index];
    const blog = myBlogs[index]; 
    res.render('blogRead.ejs', { title: title, content: blog });
  })

  app.get('/edit/:index', (req, res) => {
    const index = req.params.index; 
    const title = myTitles[index];
    const blog = myBlogs[index]; 
    res.render('edit.ejs', { title: title, content: blog });
  })

  app.post('/delete/:index', (req, res) => {
    const index = req.params.index; 
    const title = myTitles[index];
    const blog = myBlogs[index]; 

    const index1 = titles.findIndex((title1) => title1 === title);

    titles.splice(index1, 1);
    myTitles.splice(index, 1);
    data.splice(index1, 1);
    myBlogs.splice(index, 1);
    res.redirect('/my-blogs');
  })

  
  app.post('/edit', (req, res) => {
    const newTitle = req.body.blogTitle;
    const newBlog = req.body.blogContent;
    const ogTitle = req.body.originalTitle;
    const ogBlog = req.body.originalContent;

    const index = titles.findIndex((title) => title === ogTitle);
    const index2 = myBlogs.findIndex((blog) => blog === ogBlog);

        titles[index] = newTitle;
        data[index] = newBlog;
        myBlogs[index2] = newBlog;
        myTitles[index2] = newTitle;
        res.render('edit.ejs'); 
});



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });



  const titles = [
    "Exploring the Future of Technology",
    "The Art of Minimalist Living",
    "A Guide to Healthy Eating",
    "Travel Tips for Your Next Adventure",
    "The Importance of Mental Health",
    "How to Start a Small Business",
    "The Basics of Financial Planning",
    "A Journey Through Ancient History",
    "The World of Digital Marketing",
    "Creative Ways to Stay Fit",
    "Understanding Climate Change",
    "The Evolution of Social Media",
    "Mastering the Art of Public Speaking",
    "The Benefits of Meditation",
    "How to Build a Personal Brand",
    "The Science Behind Happiness",
    "Tips for Effective Time Management",
    "The Impact of Artificial Intelligence",
    "How to Improve Your Writing Skills",
    "The Beauty of Sustainable Fashion"
  ];
  
  const data = [
   `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare ex nec libero fringilla, et feugiat magna convallis. Donec sed libero sed mi consectetur lacinia. Pellentesque eu efficitur justo. Proin eleifend, sem a luctus lobortis, augue felis vestibulum mauris, id feugiat ante urna nec justo. In hac habitasse platea dictumst. Nulla ut enim et nisi ultricies efficitur. Mauris auctor ultricies turpis, at tincidunt lorem bibendum in. Suspendisse potenti.

  Phasellus tincidunt justo non nibh lobortis, vel ultricies est molestie. Nam tincidunt diam orci, ut luctus dui tincidunt vel. Duis ac metus sapien. Nullam lobortis, justo a malesuada lacinia, neque metus feugiat purus, id bibendum augue felis eget nisi. Fusce pellentesque sodales enim in vestibulum. Vivamus mollis tellus in mi tincidunt, et ultricies ex ultricies. Sed gravida justo eu fermentum suscipit.

  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque tristique, magna ac fermentum sodales, magna tortor fermentum lorem, ac efficitur nulla lectus nec eros. In tincidunt urna vitae pretium dictum. Vivamus id justo at dui rhoncus tempus ac ac nisl. Etiam at vehicula dui. Ut tempor, arcu vel auctor sodales, purus purus posuere justo, in vehicula quam ex id odio.

  Sed auctor, enim id pellentesque bibendum, risus sapien lacinia leo, eu sollicitudin nisl risus et augue. Duis eu dolor vel justo mollis pretium. Curabitur euismod, mi nec ultrices dignissim, lorem nunc rhoncus turpis, sit amet malesuada purus ligula ac ex. Aliquam fermentum, purus nec tincidunt mattis, nisi justo fringilla turpis, in consectetur urna elit id ligula. Mauris convallis tincidunt orci, a consectetur elit sollicitudin sed. Integer consectetur a purus non malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed in lobortis arcu.

  Phasellus nec ipsum a neque fermentum rhoncus. Nulla venenatis, dolor non ultrices lacinia, felis odio tincidunt felis, vel accumsan metus arcu id orci. Integer vestibulum ligula vel dui blandit, at finibus nunc molestie. Vivamus auctor luctus odio, at posuere lorem molestie eget. Sed volutpat augue eget nulla suscipit iaculis. Fusce consequat ultrices orci ac consectetur. Duis gravida est et congue rhoncus.

  Quisque dictum hendrerit est a ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In ac dui dapibus, dictum velit ac, dictum purus. Integer et vehicula tortor. Maecenas maximus sapien non justo bibendum, a posuere mi interdum. Mauris euismod dolor et nunc consequat viverra. Proin malesuada vestibulum lacus, nec viverra nisl.

  Nullam vel pharetra nulla. Sed dignissim eros eu justo lobortis, sed fermentum dolor ultricies. Nunc sit amet nulla sed elit pellentesque rutrum non ac sapien. Nulla facilisi. Vestibulum vitae ex eget nunc interdum suscipit id nec enim. Nam euismod auctor venenatis. Nullam gravida in sapien vel molestie. Sed egestas consequat pharetra. Quisque convallis, ipsum at faucibus sollicitudin, est orci consequat risus, non viverra justo lorem eu leo.

  Fusce tincidunt dolor odio, et efficitur odio placerat vel. Nullam auctor dui sed arcu interdum, at mollis purus finibus. Duis fermentum mi at turpis venenatis, nec posuere metus venenatis. Nulla ut lectus a nisl feugiat fermentum. Vestibulum id pretium elit, vitae pharetra urna. Curabitur rhoncus sapien eget massa lobortis, in aliquet nunc eleifend. Sed sed dui at dolor ultricies scelerisque.`,
    "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.",
    "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
    "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla quis lorem ut libero malesuada feugiat.",
    "Sed porttitor lectus nibh. Nulla porttitor accumsan tincidunt.",
    "Quisque velit nisi, pretium ut lacinia in, elementum id enim. Donec sollicitudin molestie malesuada.",
    "Vivamus suscipit tortor eget felis porttitor volutpat. Proin eget tortor risus.",
    "Pellentesque in ipsum id orci porta dapibus. Donec rutrum congue leo eget malesuada.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Aenean euismod elementum nisi, quis eleifend quam adipiscing vitae. Proin sagittis nisl rhoncus mattis rhoncus.",
    "Ut aliquam purus sit amet luctus venenatis lectus magna fringilla urna. Eget dolor morbi non arcu risus quis varius quam quisque.",
    "Pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna eget est lorem ipsum dolor sit.",
    "Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Feugiat vivamus at augue eget arcu dictum varius duis at.",
    "Magna sit amet purus gravida quis blandit turpis cursus in. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu.",
    "Auctor elit sed vulputate mi sit amet mauris commodo. Odio morbi quis commodo odio aenean sed adipiscing diam donec.",
    "Euismod nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus.",
    "Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et.",
    "Etiam sit amet nisl purus in mollis nunc sed id semper risus in hendrerit gravida rutrum quisque non tellus orci ac auctor augue.",
    "Convallis posuere morbi leo urna molestie at elementum eu facilisis sed odio morbi quis commodo odio aenean sed adipiscing diam."
  ];
