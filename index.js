import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import {JSDOM} from "jsdom"
import {Readability} from "@mozilla/readability"
const __dirname = dirname(fileURLToPath(import.meta.url));


const app = express();
const port = 3000;

const myBlogs = [];
const myTitles = [];
const indices = [];
const titles = [];
const data = [];
const urls = [];

const URL = "https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=17d96467c4264e9db22fe712b48429d1";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
  try {
    const response = await axios.get(URL);

    // Clear existing arrays
    titles.length = 0;
    data.length = 0;
    urls.length = 0;

    // Fetch and parse article content
    for (let i = 0; i < response.data.articles.length; i++) {
      const article = response.data.articles[i];

      if (article.content !== null) {
        // Fetch full article HTML
        const articleUrl = article.url;
        const articleHtml = await axios.get(articleUrl);

        // Parse HTML using jsdom
        const dom = new JSDOM(articleHtml.data, { url: articleUrl });

        // Extract article content using Readability
        const parsedArticle = new Readability(dom.window.document).parse();
        const clean = cleanContent(parsedArticle.textContent)
        // Push title, content, and URL to arrays
        titles.push(parsedArticle.title || article.title);
        data.push(clean);
        urls.push(articleUrl);
      }
    }

    res.render("index", { titles: titles, data: data, urls: urls });
  } catch (error) {
    console.error(error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send("An error occurred");
    }
  }
});


function cleanContent(text) {
  // Replace multiple new lines with a single new line
  let cleanedText = text.replace(/\n\s*\n/g, '\n\n');

  // Trim leading and trailing whitespaces
  cleanedText = cleanedText.trim();

  // Remove specific unnecessary data (such as dates in the format '25 Jun 2024, 11:19 PM IST')
  cleanedText = cleanedText.replace(/\b\d{1,2} [A-Za-z]{3} \d{4}(?:, \d{1,2}:\d{2} (?:AM|PM) [A-Z]{3})?\b/g, '');

  // Remove specific unnecessary phrases
  const phrasesToRemove = [
    'Also Read:',
    'Affiliate links may be automatically generated - see our ethics statement for details.',
    'For the latest tech news and reviews, follow Gadgets 360 on X, Facebook, WhatsApp, Threads and Google News. For the latest videos on gadgets and tech, subscribe to our YouTube channel. If you want to know everything about top influencers, follow our in-house Who\'sThat360 on Instagram and YouTube.'
  ];
  phrasesToRemove.forEach(phrase => {
    cleanedText = cleanedText.replace(phrase, '');
  });

  // Trim again to remove any leading/trailing whitespace after modifications
  cleanedText = cleanedText.trim();

  return cleanedText;
}



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



//   const titles = [
//     "Bard vs ChatGPT: Which is better for coding?",
//     "Bard vs ChatGPT: Which is better for coding?",
//     "Scrum vs. SAFe: Which Agile framework is right for your team?",
//     "Travel Tips for Your Next Adventure",
//     "The Importance of Mental Health",
//     "How to Start a Small Business",
//     "The Basics of Financial Planning",
//     "A Journey Through Ancient History",
//     "The World of Digital Marketing",
//     "Creative Ways to Stay Fit",
//     "Understanding Climate Change",
//     "The Evolution of Social Media",
//     "Mastering the Art of Public Speaking",
//     "The Benefits of Meditation",
//     "How to Build a Personal Brand",
//     "The Science Behind Happiness",
//     "Tips for Effective Time Management",
//     "The Impact of Artificial Intelligence",
//     "How to Improve Your Writing Skills",
//     "The Beauty of Sustainable Fashion"
//   ];
  
//   const data = [
//    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ornare ex nec libero fringilla, et feugiat magna convallis. Donec sed libero sed mi consectetur lacinia. Pellentesque eu efficitur justo. Proin eleifend, sem a luctus lobortis, augue felis vestibulum mauris, id feugiat ante urna nec justo. In hac habitasse platea dictumst. Nulla ut enim et nisi ultricies efficitur. Mauris auctor ultricies turpis, at tincidunt lorem bibendum in. Suspendisse potenti.

//   Phasellus tincidunt justo non nibh lobortis, vel ultricies est molestie. Nam tincidunt diam orci, ut luctus dui tincidunt vel. Duis ac metus sapien. Nullam lobortis, justo a malesuada lacinia, neque metus feugiat purus, id bibendum augue felis eget nisi. Fusce pellentesque sodales enim in vestibulum. Vivamus mollis tellus in mi tincidunt, et ultricies ex ultricies. Sed gravida justo eu fermentum suscipit.

//   Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque tristique, magna ac fermentum sodales, magna tortor fermentum lorem, ac efficitur nulla lectus nec eros. In tincidunt urna vitae pretium dictum. Vivamus id justo at dui rhoncus tempus ac ac nisl. Etiam at vehicula dui. Ut tempor, arcu vel auctor sodales, purus purus posuere justo, in vehicula quam ex id odio.

//   Sed auctor, enim id pellentesque bibendum, risus sapien lacinia leo, eu sollicitudin nisl risus et augue. Duis eu dolor vel justo mollis pretium. Curabitur euismod, mi nec ultrices dignissim, lorem nunc rhoncus turpis, sit amet malesuada purus ligula ac ex. Aliquam fermentum, purus nec tincidunt mattis, nisi justo fringilla turpis, in consectetur urna elit id ligula. Mauris convallis tincidunt orci, a consectetur elit sollicitudin sed. Integer consectetur a purus non malesuada. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed in lobortis arcu.

//   Phasellus nec ipsum a neque fermentum rhoncus. Nulla venenatis, dolor non ultrices lacinia, felis odio tincidunt felis, vel accumsan metus arcu id orci. Integer vestibulum ligula vel dui blandit, at finibus nunc molestie. Vivamus auctor luctus odio, at posuere lorem molestie eget. Sed volutpat augue eget nulla suscipit iaculis. Fusce consequat ultrices orci ac consectetur. Duis gravida est et congue rhoncus.

//   Quisque dictum hendrerit est a ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In ac dui dapibus, dictum velit ac, dictum purus. Integer et vehicula tortor. Maecenas maximus sapien non justo bibendum, a posuere mi interdum. Mauris euismod dolor et nunc consequat viverra. Proin malesuada vestibulum lacus, nec viverra nisl.

//   Nullam vel pharetra nulla. Sed dignissim eros eu justo lobortis, sed fermentum dolor ultricies. Nunc sit amet nulla sed elit pellentesque rutrum non ac sapien. Nulla facilisi. Vestibulum vitae ex eget nunc interdum suscipit id nec enim. Nam euismod auctor venenatis. Nullam gravida in sapien vel molestie. Sed egestas consequat pharetra. Quisque convallis, ipsum at faucibus sollicitudin, est orci consequat risus, non viverra justo lorem eu leo.

//   Fusce tincidunt dolor odio, et efficitur odio placerat vel. Nullam auctor dui sed arcu interdum, at mollis purus finibus. Duis fermentum mi at turpis venenatis, nec posuere metus venenatis. Nulla ut lectus a nisl feugiat fermentum. Vestibulum id pretium elit, vitae pharetra urna. Curabitur rhoncus sapien eget massa lobortis, in aliquet nunc eleifend. Sed sed dui at dolor ultricies scelerisque.`,
//     `For programmers, Generative AI offers tangible benefits. It helps with writing and debugging code, making our busy lives a bit easier as a result. But there are now competing tools like ChatGPT and Bard, which begs the question: which one is best for me to use?

// We compare these tools against each other in the ultimate battle to see which is the most feature-rich tool right now for programming purposes.

// ChatGPT robot vs Bard robot
// Bard vs ChatGPT: What’s the difference?
// The biggest difference between ChatGPT and Bard is the Large Language Models (LLMs) they are powered by. ChatGPT uses the Generative Pre-trained Transformer 4 (GPT-4), while Bard uses the Language Model for Dialogue Applications (LaMBDA). Also, ChatGPT is developed by OpenAI, while Bard was built by Google.

// In terms of capabilities, both do very similar things. Programmers can use ChatGPT for:
// Suggestions: Both models can suggest the correct syntax and parameters for functions and other code constructs.

// Completion: It can complete code that you have started writing.

// Debugging: It can help you identify errors and problems in your code.

// Explanation: It can explain the code that it generates, or code you input.

// Both models were trained on a massive dataset, including Common Crawl, Wikipedia, books, articles, documents, and content scraped from the internet. However, Bard is a little different in that it was trained on conversations and dialogues from the web, while ChatGPT was trained mostly on scraped general content.

// Both products are still under development, Bard a bit more so than ChatGPT. But to really show how these differences actually matter in a practical sense, here’s how they work when tested against each other.

// Testing ChatGPT and Bard against each other
// We chose seven categories to test the chatbots against each other, based on what we felt were the most relevant: code generation, problem solving, refactoring code, debugging assistance, third-party plugins/UI extension, ease of use, and cost. Let's preface this by saying this is not a rigorous scientific comparison, but rather a handful of tests mixed with our hands-on experience to date.

// 1. Code generation
// The bread and butter of what we want it for, right? For this, we fed in the following prompt: "Write a function in python that returns a list of 100 prime numbers." 

// Bard's coding attempt
// def get_prime_numbers(n):
//   """Returns a list of prime numbers up to n."""
//   primes = []
//   for i in range(2, n + 1):
//     is_prime = True
//     for j in range(2, i):
//       if i % j == 0:
//         is_prime = False
//         break
//     if is_prime:
//       primes.append(i)
//   return primes


// def main():
//   """Prints a list of 100 prime numbers."""
//   primes = get_prime_numbers(100)
//   print(primes)


// if __name__ == "__main__":
//   main()
// Looks solid, but does it work? In our experience, chatbots can sometimes create code that doesn't run, even going as far as to invent functions! That's one reason having AI-generated code in production with no human oversight would be very bad. So let's test it out and see.

// Checking the result of a bard code test
// ChatGPT's coding attempt
// def generate_primes(n):
//     primes = []
//     sieve = [True] * (n + 1)
//     for current in range(2, n + 1):
//         if sieve[current] != 0:
//             primes.append(current)
//             for multiple in range(current, n + 1, current):
//                 sieve[multiple] = False
//     return primes

// # Generate first 100 prime numbers
// # The 100th prime number is 541, so we set the limit to 550 to make sure we get at least 100 primes
// primes_100 = generate_primes(550)[:100]
// print(primes_100)
// When we run the same prompt by ChatGPT, this code defines a function generate_primes(n) that takes an integer n as input and returns a list of all prime numbers up to n. It uses the Sieve of Eratosthenes algorithm to generate the primes.
// Both of these produced a functional result. ChatGPT's example is better in this case, since it's cleaner and has much less code. Also, it interpreted our vague prompt correctly. However, this is only one use-case: it's known that chatbots will vary a lot in their response depending on the language they are using (With less common or documented languages having more errors) or the complexity of the query. So let's see how Bard and ChatGPT handle different use cases.

// Winner: ChatGPT 🏆
// 2. Problem Solving
// Let's see how of these LLMs handle a problem. Rather than just asking them to write a generic function, let's throw a programming problem at them from Leetcode:

// Write JavaScript code that enhances all arrays such that you can call the array.last() method on any array and it will return the last element. If there are no elements in the array, it should return -1.

// ChatGPT's problem solving
// Here's how you would do it in JavaScript:

// Array.prototype.last = function() {
//   if (this.length === 0) {
//     return -1;
//   } else {
//     return this[this.length - 1];
//   }
// };

// In this code:

// Array.prototype.last adds a new method called last to the Array.prototype object. This ensures that all arrays will have this method.

// this refers to the array object on which the last method is being called.
// this.length gives the number of elements in the array.
// If the array is empty (this.length === 0), the method returns -1.
// Otherwise, the method returns the last element of the array: this[this.length - 1].

// Here is how you would use it:

// let array = [1, 2, 3, 4, 5];
// console.log(array.last()); // prints: 5

// array = [];
// console.log(array.last()); // prints: -1

// Remember that extending built-in JavaScript objects like Array is generally not recommended, as it can lead to conflicts if the JavaScript environment (like a browser or Node.js) adds a method with the same name. This is generally called monkey patching and is usually avoided in production-grade code. But for quick and dirty hacks, or to understand how JavaScript works, it's a fun tool to use!
// Not only does ChatGPT solve the problem, but it explains the problem. Neat! Let's run the code through leetcode and see if it actually passes the tests, though.

// Testing ChatGPT's problem solving with leetcode
// It looks like ChatGPT solved the problem on the first try! Now it's time for Bard to step up to the plate.

// Bard's problem solving
// Sure, here is the JavaScript code that enhances all arrays such that you can call the array.last() method on any array and it will return the last element. If there are no elements in the array, it should return -1:


// // Define a new method on the Array prototype
// Array.prototype.last = function() {
//   // If the array is empty, return -1
//   if (this.length === 0) {
//     return -1;
//   }

//   // Otherwise, return the last element
//   return this[this.length - 1];
// };


// Here is an example of how to use the array.last() method:


// const array = [1, 2, 3, 4, 5];

// // Get the last element of the array
// const lastElement = array.last();

// // Print the last element of the array
// console.log(lastElement); // 5
// Okay, so we didn't get as thorough an explanation from Bard about how the code works. However, it's nearly identical when you compare what ChatGPT and Bard produced. Were they looking at each other's homework?

// ChatGPT vs Bard comparing problem solving
// Naturally, we can't take Bard's word at it, so we run the test through Leetcode, and...

// Testing Bard's problem solving with Leetcode
// ... It works! Which is to be expected, given the answer was nearly identical to ChatGPT's.
// When it comes to problem solving, it's a tough call between the two. While they produce nearly identical results, ChatGPT explains the code much better for you, which is pretty good for actually learning how to fish instead of having ChatGPT just fish for you. This has been our overall experience with using ChatGPT: not only do you get a possible solution for your problem, but ChatGPT walks you through it a bit more.

// Winner: ChatGPT 🏆
// 3. Refactoring Code
// Let's say you want to find a more optimized way to do something. It's great to get a different viewpoint on your code, and unlike your teammates (assuming you have them), these tools are always free and ready to check over your code. So let's see how it does! Here's the sample we provided it.

// What is a more optimized way to write this code?

// Array.prototype.last = function() {
//   if (this.length === 0) {
//     return -1;
//   } else {
//     return this[this.length - 1];
//   }
// };
// ChatGPT's refactoring attempt
// Refactoring with ChatGPT
// So ChatGPT's given us a pretty vague response. It vaguely explains the code and suggests a ternary operator, which is fine and worth checking out. However, it feels like it could have done a bit more. Let's see how Bard handles the same assignment.

// Bard's refactoring attempt
// Bard's attempt at debugging code
// Wow! The difference between ChatGPT and Bard is like chalk and cheese: Bard has clearly gone above and beyond. Not only does it offer optimized code, but it shows code to create a benchmark, and shows benchmark results.

// Overall, we've found Bard is a bit better at refactoring. Part of this is likely because Bard uses search engine information on top of being a Large Language Model (LLM), while ChatGPT is currently just an LLM. However, I should state that ChatGPT is currently beta-testing a "Search with Bing" feature and rolling this out to free users, so ChatGPT may become a whole lot better at refactoring code very soon. But for now, we have to give the win to Bard.

// Winner: Bard 🏆
// 4. Debugging assistance
// Bugs are part of life. Let's throw an obviously flawed bit of code at both tools, and see how well it picks it up. See if you can spot it before ChatGPT and Bard do! Here's the prompt we used: Debug the following code that has an error. Provide code that fixes possible errors with it.

// def calculate_average(numbers):
//     total = 0
//     for number in numbers:
//         total += number
//     average = total / len(numbers)
//     return average
// ChatGPT's debugging attempt
// ChatGPT debugging
// All right, ChatGPT has given us back a response saying we need to add some logic to prevent a "Zero Division" error. It gives an option for doing so and explains the problem. Now it's Bard's turn.

// Bard's debugging attempt
// Bard at debugging
// Bard found the same problem with the function that ChatGPT did. But once again, Bard has given a much more detailed explanation. It outlines possible errors, explains how to fix them, tells us how to use the function and what the output would be. Whew!

// For debugging, we've found in general that Bard is much more thorough in its answers and explanations. There have been times where we've found ChatGPT has discovered bugs better, but by and large, Bard provides clearer examples to the user.

// Bard wins this one, and so we're tied 2-2. Can one of them break the stalemate?

// Winner: Bard 🏆
// 5. Third-party plugins & UI extensions
// By connecting a third-party plugin to an LLM, we can extend their capabilities in some wild ways, letting them run code in the chat conversation or integrate with apps like Zapier. 

// ChatGPT offers over 80 plugins to its premium subscribers as a beta feature right now. To learn about some of these, check out our article: “The top ChatGPT plugins for developers.” Here's an example of ChatGPT's plugin store right now:

// ChatGPT plugin store
// And here's an example of Bard's plugin store:

// ...Well, I can't show you anything, because it doesn't exist! It is rumored to be on the roadmap, but there's no timeframe as of yet.

// If you don’t want to use the web interface, both ChatGPT and Bard offer an API. However Bard's API is still limited to invite only, so we didn’t get to test it. ChatGPT's API, however, is very thorough and complete. ChatGPT also has an official mobile app, which is surprisingly useable, and quite handy while ideating.

// For this one, we have to give the point to ChatGPT, due to Bard either not having the features yet, or hiding them behind an invite list.

// Winner: ChatGPT 🏆
// 6. Ease of Use
// Okay, so upfront, both ChatGPT and Bard are very easy to use. They both have a web interface where you enter a prompt and get a response. Fairly straightforward, right? They also both have "conversations" where they can hold context. However, there are differences between the two.

// One big difference is how ChatGPT keeps track of your conversations. They're stored on the left hand side of the screen, there's no limit to the length of them, and they're always accessible. You can also delete them whenever you want.

// ChatGPT's interface
// In comparison, Bard doesn't allow you to store and access your past conversations. You can access your history and look up what you've searched, but you can't click and restart a conversation like you can with ChatGPT. You can only see what you typed for a prompt. On top of this, Bard limits the length of the conversation, so you have to start over if it goes for too long.

// Conversations with Bard
// One feature Bard has that ChatGPT doesn't is the "drafts" feature. In Bard, you have access to a set of drafts so you can review different responses to your prompt, which is helpful. However, even with this, we found ChatGPT easier to use and more powerful.

// Bard drafts feature
// Winner: ChatGPT 🏆
// 7. Cost
// Any tool needs to have a section on how much it costs, right? ChatGPT has both a free and premium version called ChatGPT Plus, billed at $20 a month. Premium subscribers get access to real-time internet searching features, plugins, better answers from the GPT-4 model, faster response times, priority access to new features, and access during peak times.

// In comparison, Bard is free to everyone who has access. Getting this access requires a personal Google Account that you manage on your own, or a Google workspace account for which your admin has enabled access to Bard with (Which can be a bit disappointing if they haven’t). 

// It’s likely Bard will be commercialized at some point, but given it’s free vs freemium right now, Bard wins by default.

// Winner: Bard 🏆
// Conclusion: ChatGPT wins out, but both tools are useful!
// At a score of four to three, ChatGPT wins overall (👑), but in practice both of these tools should be a part of your arsenal. Here are some key points to keep in mind as a developer using these tools:

// The base version of ChatGPT is a LLM only, which means the information can be out of date. Bard uses both LLM and search data. This is going to change fairly soon, with ChatGPT implementing “Search with Bing” into its free offering.

// ChatGPT is generally better for generating documentation

// Bard creates more thorough explanations of code most of the time

// Bard limits the length of the conversation, ChatGPT only limits requests over time (GPT-4)

// Remember that even if you’re using these tools, it’s important to understand the code you're working with. Don't become too reliant on them because the results are not guaranteed to be accurate at any point. Till next time, happy coding!`,
//     `Agile project management has made waves through software development circles. Much of Agile’s appeal lies in its flexibility. Thanks to its range of strategies, you can pick an Agile framework suited to your unique needs or strengths. With this in mind, many organizations choose between the Scrum vs. SAFe approach. 

// While both frameworks are popular, they can reshape your organization in different ways. So, when deciding between Scrum vs. SAFe, you have to consider your resources and goals. To help you pick the best framework, we’ll describe both approaches, their similarities and differences, and the kind of teams they’re best suited for.

// Table of contents:

// What is Scrum?
// What is SAFe? 
// Key differences between SAFe and Scrum 
// How to choose the best framework for your team 
// Similarities between Scrum and SAFe
// Scrum@Scale: Reaching for the best of both worlds 
// Improve your software delivery process with Pluralsight Flow
// What is Scrum?
// Scrum is an Agile framework in which small, self-organized teams deliver high-quality software quickly. Scrum development values simplicity, creating adaptable teams that make deliveries based on stakeholder input. To make this work, Scrum devs break large projects into small steps. 

// By building cross-functional teams, Scrum empowers devs to address multiple issues and project types. Its small team structure also maintains productivity and cost-effectiveness as requirements change. Smaller teams also ensure every dev knows who to talk to about specific issues. This streamlined setup fosters collaboration and lets team members review their work more thoroughly.

// Scrum development relies on three key roles:

// Product Owners align a Scrum team’s goals with customer and stakeholder expectations. They can also provide feedback or insight on product requirements. 
// Scrum Masters oversee a Scrum team and Scrum processes. They remove dev obstacles, keeping team members productive and on task.
// Scrum teams work with the above two roles to complete the goals outlined in each sprint planning phase. They’re the boots-on-the-ground employees who build a product.
// Image depicting the definition and process involved in the Scrum software development methodology
// Pros and cons of Scrum
// To better understand Scrum, here are its main advantages and drawbacks.

// Pros:
// Optimized dev processes

// Emphasis on the end user’s wants

// Fast delivery times

// Easy coordination within small teams

 

// Cons:
// Difficult to scale to larger projects

// Requires teamwide training

// Dev cycles may not always align with project deadlines

// Who is Scrum best for?
// Scrum complements small organizations and independent teams. In particular, you should use Scrum if your devs run up against:

// Frequent input from stakeholders and customers

// Changing deliverables teams must adapt to

// Short turnaround times before delivering high-quality products

// What is SAFe?
// The Scaled Agile Framework (SAFe) helps organizations set objectives and meet customer demands. Whereas Scrum relies on narrow focus and small teams, SAFe is more comprehensive. It coordinates multiple groups and leaders to deliver products too large or complex for Scrum.

// SAFe exchanges Scrum’s flexibility for a more rigid structure. While it offers continuous development, SAFe sets objectives that vary by team. However, these different groups complement one another and work toward the same end goals. To manage this organization, SAFe incorporates three core tenets:
// Lean Product Development reduces waste and optimizes processes. This cost-effective approach maintains productivity during continuous development. 
// Agile Software Development involves incremental changes made on the fly. This iterative approach accounts for feedback and new demands. While less flexible than Scrum, SAFe still makes room for fast adaptations in development.
// System Thinking is a dev approach that builds solutions holistically. When designing a product, teams would incorporate all aspects of the system. This approach highlights how all parts of a system relate and fit into larger systems.
// Image depicting the definition and process involved in the SAFe software development methodology
// Pros and cons of SAFe
// Like Scrum, SAFe’s pros and cons lend themselves to some teams more than others.

// Pros:

// Agility and a competitive edge for businesses

// Increased cooperation between teams

// Added barriers to prevent product issues

// Improved operations at an enterprise level

 

// Cons:

// Poor fit for small businesses and startups

// Teams must learn shared Agile language

// Relies on a more rigid, top-down framework

// Who is SAFe best for?
// SAFe works best for organizations that practice Agile at an enterprise scale. Specifically, it suits organizations that:

// Oversee multiple teams 

// Follow a top-down approach to leadership

// Build complex, cross-team solutions

// Key differences between SAFe vs. Scrum
// Before going over each section at length, here are the major differences between Scrum and SAFe.

// Category

// Scrum

// SAFe

// Organization structure

// Small organizations with independent teams

// Enterprises with interconnected teams

// Development philosophy 

// Fast, continuous development

// Goal setting with organizational commitment

// Implementation 

// Small teams with straightforward goals

// Organizations tackling complex projects across teams

// Processes

// Lightweight, flexible, and iterative software delivery

// Clear objectives set with a predetermined schedule 

// Framework requirements

// A whole team must embrace Scrum

// An entire organization must embrace SAFe

// Team roles

// Less than 12 members broken into three roles

// Dozens of employees working within several roles

// Dependencies

// Coordination within teams

// Alignment between teams

// Timeframe

// Sprints last one to four weeks

// Sprints last two weeks

// How to choose the best framework for your team
// The right Agile approach for an organization depends on its goals, structure, and processes. When picking between SAFe vs. Scrum, keep the following factors in mind. 

// Organization structure
// Scrum and SAFe fit different types of organizations. Scrum suits small companies or ones with independent teams. On the other hand, SAFe applies to larger enterprises with interconnected teams working together. 

// Development philosophy
// Scrum strives to provide continuous development at a low cost. Self-contained teams can organize themselves to quickly deliver high-quality software and make regular improvements over time. This creates a feeling of project ownership that Scrum teams may fail without.

// SAFe is designed to enable large businesses or organizations to be nimble and agile while ensuring stability and structure for their teams. SAFe follows a more formalized strategy of setting clear targets based on a client’s needs. From there, teams rigidly pursue those goals within preset guidelines. While it gives room for flexibility and updates, SAFe development involves more oversight and structure. After all, requirement changes make waves through more than one self-contained group.
// Implementation strategy
// How and why you implement Scrum or SAFe should tie into your overall strategy:

// Implement Scrum when you need a small team to operate cohesively on projects with straightforward goals. 

// Implement SAFe to tie your whole organization together. Keep in mind this necessitates cooperation between teams.

// Processes
// Scrum leans on adaptable, lightweight methods that break larger projects into smaller steps. To prevent issues, you have to assess your deliverables regularly. Still, this approach maintains momentum on difficult projects. It also streamlines adjustments after stakeholder feedback.

// SAFe employs more clear-cut roles that aren’t dependent on small, flexible teams. SAFe processes ensure quality production and cooperation on a business-wide level. While it takes more planning to organize, it affords greater resources.

// Framework requirements
// To implement Scrum, you only need one team. Ideally, this team will operate with a lot of independence and self-management. SAFe, on the other hand, takes more organizational commitment. Teams need to open themselves to sharing goals and processes in a more unified approach. 

// Team roles and structure
// Small teams with a dozen or fewer employees can embrace Scrum. Scrum divides tasks between the Product Owner, Scrum Master, and Scrum team. In some cases, Scrum can organize an entire startup or small business.

// SAFe encompasses multiple teams across an organization. Entry-level employees, managers, and high-level engineers all work together. It involves roles like:

// Release train engineers

// Program managers

// Value stream engineers

// Solution architects

// Epic owners

// Product owners

// Team dependencies
// While both frameworks come with team dependencies, the amount varies. With Scrum, teams can self-organize and independently manage their work. In a SAFe context, you need coordination between many teams. As a result, dependencies increase with the need for alignment. 

// Timeframe
// Both Agile frameworks operate within sprints, a relatively short production cycle. Of all the Agile ceremonies, these sprints stand as one of the most important. 

// Cycle length varies by approach:

// One to four weeks within Scrum teams

// About two weeks within SAFe teams

// Similarities between Scrum vs. SAFe
// Chart depicting the similarities between the Scrum and SAFe software development processes
// Despite their differences, Scrum and SAFe share a lot in common. As two Agile frameworks, they’re built on a similar foundation. We’ll break down the main ways they overlap below:

// Team-based development: Both Scrum and SAFe rely on teams more than individual devs. Coordinated efforts within one or more teams move production along.
// Incremental approaches to high-quality deliveries: Agile methods deliver the best products in smaller increments. While Scrum breaks steps into increments within one team, SAFe does so across more than one. 
// Cooperation with stakeholders: Agile teams cooperate with stakeholders. Together, they can assess requirements, share feedback, incorporate customer suggestions, and make adjustments before or after deploying a product.
// Inspect and adapt strategies: Regular inspections and direction adjustments play a role. In Scrum, a review follows each sprint. In SAFe, these checks come throughout the release train. Development priorities may change based on these inspections. 
// Timeboxing: Both approaches use timeboxing for time management. Timeboxing entails setting aside the maximum amount of time needed to complete an activity. By finishing steps in the timebox, projects stay on track. 
// Continuous delivery pipelines (CDP): Scrum and SAFe use a continuous delivery pipeline. This approach delivers software updates at frequent, regular intervals. It also leverages automation to quickly move products through testing, staging, and production.
// Scrum@Scale: Reaching for the best of both worlds
// To work around Scrum’s reliance on small teams, some organizations have used Scrum@Scale. This attempt at scaling Scrum comes with a few changes in line with SAFe. Scrum@Scale loops different groups and devs into a central, interchangeable team. Through this process, employees form networks and ecosystems to collaborate on shared goals.

// Scrum@Scale brings many of Scrum’s benefits over to larger organizations. As such, they may have to choose between Scrum@Scale vs. SAFe. While this avoids some complexity and unites employees with common goals, it involves more careful management than Scrum. To mitigate these issues, Scrum@Scale introduces new roles:

// The Chief Product Owner (CPO) oversees individual Product Owners and teams. The CPO aligns each team within a wider strategic approach. 
// The Scrum of Scrums Master (SoSM) manages individual Scrum Masters and organizes shared processes.
// `,
//     "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla quis lorem ut libero malesuada feugiat.",
//     "Sed porttitor lectus nibh. Nulla porttitor accumsan tincidunt.",
//     "Quisque velit nisi, pretium ut lacinia in, elementum id enim. Donec sollicitudin molestie malesuada.",
//     "Vivamus suscipit tortor eget felis porttitor volutpat. Proin eget tortor risus.",
//     "Pellentesque in ipsum id orci porta dapibus. Donec rutrum congue leo eget malesuada.",
//     "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//     "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//     "Aenean euismod elementum nisi, quis eleifend quam adipiscing vitae. Proin sagittis nisl rhoncus mattis rhoncus.",
//     "Ut aliquam purus sit amet luctus venenatis lectus magna fringilla urna. Eget dolor morbi non arcu risus quis varius quam quisque.",
//     "Pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna eget est lorem ipsum dolor sit.",
//     "Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Feugiat vivamus at augue eget arcu dictum varius duis at.",
//     "Magna sit amet purus gravida quis blandit turpis cursus in. Scelerisque eu ultrices vitae auctor eu augue ut lectus arcu.",
//     "Auctor elit sed vulputate mi sit amet mauris commodo. Odio morbi quis commodo odio aenean sed adipiscing diam donec.",
//     "Euismod nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus.",
//     "Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et.",
//     "Etiam sit amet nisl purus in mollis nunc sed id semper risus in hendrerit gravida rutrum quisque non tellus orci ac auctor augue.",
//     "Convallis posuere morbi leo urna molestie at elementum eu facilisis sed odio morbi quis commodo odio aenean sed adipiscing diam."
//   ];
