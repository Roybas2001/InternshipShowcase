---
layout: ../../layouts/MDLayout.astro
title: 'Readme Docs'
subtitle: 'Readme for the presentation site'
---

## Internship WebElephant

Made with [astro](https://astro.build)

## ✅ Commands

All commands are run from the root of the projet, from a terminal:

| Command                       | Action                                           |
| :-----------------------------| :----------------------------------------------- |
| `npm install`                 | Installs dependencies                            |
| `npm run dev`                 | Starts local dev server at `localhost:4321`      |
| `npm run build`               | Build your production site to `./dist/`          |
| `npm run preview`             | Preview your build locally, before deploying     |
| `npm run astro ...`           | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help`     | Get help using the Astro CLI                     |
| `npm run start:both`          | Starts local dev server at `localhost:4321` and the `php` server | 

## Content

- How is the site made?
- What is displayed on the site?
- Cypress showcase

### How is the site made?

The website is build with the framework: [Astro](https://astro.build). Why is it build using the Astro framework? During the beginning of my internship I was working on a project for WebElephant, I wanted to try and implement a solution I used before for another project. But unfortunaly I forgot the solution, this is where GitHub was my savior and I was able to look for the old project and find the solution I was looking for. When I was done browsing in the repository for the solution I saw that a friend of mine started following the astro repository. I was intrigued by the repository because that friend is quite good at programming and only follows repo's when they match his specific criterea's. Then I started reading the documentation behind Astro and started to figure out the reason why my friend followed the repository.

[2023 WebFramework Performance Report](https://astro.build/blog/2023-web-framework-performance-report/) showcases the speed improvements when using Astro framework, when reading through the article I stumbled accross the CWS (core web vitals) section and saw a huge improvement on the sites that pass the CWS when using Astro compared to other frameworks like: SvelteKit, Next.js and WordPress. This had me interested how Astro made such big improvements compared to the other frameworks. One of the big reasons why Astro was so much better, was because of the Javascript payload that is send to the client. By sending smaller and less JavaScript payload to the client the site has a bigger probability to pass the CWS. By utilizing the concept of islands in the framework Astro is able to reduce the JavaScript overhead and complexity compared to the other frameworks.

In the internship showcase I am still utilizing a lot of React components in the site, this will decrease the overall performance of the site, but because this is not so very important it is not nesseceraly needed to improve on this concept. All the React components are connected through the island concept, so this is already a small improvement. When looking at the Projects part of the website you might see that these are generated based on a txt file that contains object like lines of text, these are retrieved via a PHP file that converts the contents of the txt file to an actual JavaScript object.

The PHP file explained:
```php
<?php
// CORS Policy
header('Access-Control-Allow-Origin: http://localhost:4321');

function readFileToArray()
{
    // The path to the projects 'storrage' file
    $pathToFile = "../src/constants/projects.txt";

    // Open the file
    $contents = file_get_contents($pathToFile);

    // Initialize an empty array
    $line_arr = [];

    // Remove the enters in the file
    $lines = explode("\n", $contents);

    // Debug line by line
    foreach ($lines as $line) {
        $line = trim($line, " \t\n\r\0\x0B,"); // Trim whitespace
        if (!empty($line)) { // If there is a line decode json format and add it to the var $project
            $project = json_decode($line, true);
            if ($project !== null) { // If contains something add it to the array
                array_push($line_arr, $project);
            } else {
                echo "Error decoding JSON: " . json_last_error_msg() . "<br>";
                echo "Malformed JSON Line: " . $line . "<br>";
            }
        }
    }

    // Send the array back to be used.
    return $line_arr;
}

// Only accept the request if the method is 'GET' else response with a 405 code
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Call the function
    $line_arr = readFileToArray();

    // Send Data to front-end in JSON format
    echo json_encode($line_arr);
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
```

When looking at the comments placed in the code we can se what all the parts are doing to the content of the projects.txt file.

So we now know the way to retrieve the project we can look at the page that adds the projects to the site. This is also done using a PHP file. (Since this is a local project that will never go live to the public I haven't put in any security policies.)

The add file to project.txt file:
```PHP
<?php
header('Access-Control-Allow-Origin: http://localhost:4321');

// Function to append data to the file
function appendToFile($data) {
    $pathToFile = "../src/constants/projects.txt";

    // Open the file in append mode
    $file = fopen($pathToFile, "a");

    // Append the data
    fwrite($file, $data);

    // Close the file
    fclose($file);
}

// Check if form data is recieved.
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form data
    $id = $_POST["id"];
    $title = $_POST["title"];
    $subtitle = $_POST["subtitle"];
    $filename = $_POST["filename"];

    // File upload
    $file = $_FILES["file"];
    $targetDirectory = "../src/pages/posts/";

    // Modify the target file path to include "Docs" prefix
    // and the filename from the form input
    $targetFile = $targetDirectory . "Docs" . $filename . ".md";

    // Move the uploaded file to the target directory with the modified filename
    move_uploaded_file($file["tmp_name"], $targetFile);

    // Format the data
    $data = array(
        "id" => $id,
        "title" => $title,
        "subtitle" => $subtitle,
        "filename" => "Docs" . $filename
    );

    // Encode the Data and place an enter at the end.
    $json_data = json_encode($data) . ",\n";

    // Append the data to the file
    appendToFile($json_data);

    // send response
    echo "Data appended successfully";
} else {
    http_response_code(405);
    echo "Method not allowed";
}
?>
```

In this file we have the same CORS policy as before but now we have a request method of "POST" if the request method is met we can initialize the data that was passed from the front-end. We also recieve a file from the front-end that we need to add somethings to, we need to append the part: "Docs" to the beginning of the file and make the file an Markdown file. Since we send the data from the front-end in the correct format we only need to append it to the project.txt file. 

### What is displayed on the site?

Just like a presentation we start with a "title" screen were we simply display the purpose of the site, in this case it is the internship showcase. In the title screen we also display a 3D model that we can configure in multiple ways. The 3D model has been added purely because I was curious if it was possible with the Astro framework. When using a file with the .Astro extension I couldn't really figure it out so I opted to use React.

After the "Title" page we move on the a small overview where I put some text that includes some information about the company. Since we have international colleagues everything is made in English, in case they would also like to read my progress reports. In the overview section there is also a 3D model of an cartony earth, to highlight the fact that we have international colleagues. Since the 3D model is viewed from space I want to add stars in the background. The stars are simply copied of a old project. But in this particular case the stars will be generated every day with a different colour. This done using a sudo random hex value genarator, we first get the current date values and then generate a sudo random hex value using the current date as a seed value. The hex value is passed to the stars.

Then we have an overview of the projects I worked on during my internship that required documentation for it. The way the projects are created and loaded we already discussed. With the documentation files we can get more insight about the thought process behind every step I took.

After that we have a Cypress overview section. This is made to display the way Cypress will interact when it is integrated in the HIVE dashboard. We would select a test, press the button and the test will start from the pipeline. In this project there is no pipeline integrated. So we create a new PHP file that will execute a shell command to run the Cypress test. We pass along the data from the front end the same way as we do it when creating a new project. Then we pass the data to a function to execute the shell command and pass the result to a helper function that removes unnessecary characters and white spaces. We also remove some parts of the string because they are of no use for us to display.

### Cypress showcase

In the part of the Cypress showcase we try to replicate the process that will be executed in the dashboard. We select an account (In this case we select a test), we click on the button to start the test. In the dashboard this will start the test for the account through the pipeline, in my case we simlpy start a test via a `shell_exec` in the PHP file:

```PHP
<?php
header('Access-Control-Allow-Origin: http://localhost:4321');

function executeCypress($scriptID)
{
    $output = shell_exec("cd .. && npx cypress run --spec **/" . $scriptID . ".cy.ts");

    tableCreator($output);
}

function tableCreator($output)
{
    // Remove Non essential lines
    $output = str_replace('(/Users/Roy/Library/Application Support/Herd/config/nvm/versions/node' , '', $output);
    $output = str_replace('/v18.19.1/bin/node)', '', $output);

    // Remove all the special characters from each line
    $output = preg_replace('/[=─┌│┐└┘]/u', '', $output);

    // Explode the output by newlines
    $lines = explode("\n", $output);

    $table = '<table class=w-full>';

    foreach ($lines as $line) {
        // Skip empty lines
        if (trim($line) !== '') {
            $table .= '<tr><td class="text-[12px] p-2 w-full">' . htmlspecialchars($line) . '</td></tr>';
        }
    }

    $table .= '</table>';

    echo $table;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve Selection Data
    $scriptID = $_POST["id"];

    if ($scriptID === "invalid" || $scriptID === "undefined") {
        echo "Please select a valid option.";
    } else {
        executeCypress($scriptID);
    }
} else {
    http_response_code(405);
    echo "Method not allowed";
}
```

As you can see in the bottom part of the code we filter out the options: invalid and undefined. This is because I use a select option in the front-end, when no option is selected it will pass the undefined variable, and we selecting the option "Select an option" it will pass the invalid variable. The other option is the test so it will be passed to the `executeCypress()` function.