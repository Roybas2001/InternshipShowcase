---
layout: ../../layouts/MDLayout.astro
title: 'PixelMatchWE Docs'
subtitle: 'PixelmatchWE usage documentation'
---

<h2 align="left" style="color: #ff0029;">Table of Contents</h2>

- [When to use](#whentouse)
- [Requirements](#requirements)
- [Steps](#steps)
- [Testing](#testing)

<br>
<h2 align="left" id="whentouse" style="color: #ff0029;">When to Use</h2>

<span style="color: #ff0029; font-weight: 900;">PixelmatchWE:</span>
Even minor code adjustments can inadvertently alter the look of your website. PixelmatchWE comes to the rescue by enabling pixel-by-pixel comparison of before-and-after screenshots. Let's say you've adjusted the CSS styles or layout of your site. Before deploying these modifications, use PixelmatchWE to identify any visual discrepancies between the current and updated versions. By pinpointing differences in detail, PixelmatchWE empowers you to rectify unintended changes swiftly, preserving the polished appearance of your website.

<br>
<h2 align="left" id="requirements" style="color: #ff0029;">Requirements</h2>

### Composer
- symfony/process

<br>
<h2 align="left" id="steps" style="color: #ff0029;">Steps</h2>

Let's start by installing the required package:

### Composer
* Composer require symfony/process
---
<br>
<h3 align="left"  style="color: #ff0029;">PixelMatch rework</h3>

In the pixelmatch-php from spatie they depend on the javascript package mapbox/pixelmatch. We don't want to rely on the javascript file to compare the images we use so we rebuild it in PHP. Since PHP has all the functions needed built in to the language we can access those.

<br>
<h3 align="left"  style="color: #ff0029;">pixelmatch.js Rework</h3>

So the javascript file needs to be rewritten in php

The javascript file:
<br>

```javascript
#!/usr/bin/env node

const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

try {
    const args = JSON.parse(process.argv.slice(2));

    getMatchingPercentage(args[0], args[1], args[2], args[3]);
} catch (error) {
    console.error(error);
    process.exit(1);
}

function getMatchingPercentage(imagePath1, imagePath2, options = {})
{
    const img1 = PNG.sync.read(fs.readFileSync(imagePath1));
    const img2 = PNG.sync.read(fs.readFileSync(imagePath2));

    // Create an empty diff image
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const mismatchedPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        options
    );

    process.stdout.write(JSON.stringify({
        mismatchedPixels,
        width,
        height,
    }))
}
```
<br>

The new php file:
```php
<?php
// Define a custom function to compare two images and get mismatched pixels
function compareImages($imagePath1, $imagePath2, $outputPath)
{
    if (empty($imagePath1) || empty($imagePath2)) {
        throw new Exception("Image paths cannot be empty");
    }

        // Check image types
        $imageType1 = exif_imagetype($imagePath1);
        $imageType2 = exif_imagetype($imagePath2);
        if ($imageType1 !== $imageType2) {
            throw new Exception("Image types do not match");
        }

    // Load images
    $image1 = imagecreatefrompng($imagePath1);
    $image2 = imagecreatefrompng($imagePath2);

    if ( !$image1 || !$image2) {
        throw new Exception("Failed to load images");
    }

    // Get image dimensions
    $width = imagesx($image1);
    $height = imagesy($image1);

    // Compare images
    $mismatchedPixels = 0;
    $mismatchedCoordinates = [];
    $mismatchedPixelsX = [];
    $mismatchedPixelsY = [];
    for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
            // Get pixel colors
            $color1 = imagecolorat($image1, $x, $y);
            $color2 = imagecolorat($image2, $x, $y);

            // Compare colors
            if ($color1 !== $color2) {
                $mismatchedPixels++;
                $mismatchedCoordinates[] = ['x' => $x, 'y' => $y];
                $mismatchedPixelsX[] = $x;
                $mismatchedPixelsY[] = $y;
            }
        }
    }

    // Output results
    echo json_encode([
        'mismatchedPixels' => $mismatchedPixels,
        'mismatchedCoordinates' => $mismatchedCoordinates,
        'width' => $width,
        'height' => $height,
        'mismatchedPixelsX' => $mismatchedPixelsX,
        'mismatchedPixelsY' => $mismatchedPixelsY,
        'outputPath' => $outputPath,
    ]);


    // Free memory
    imagedestroy($image1);
    imagedestroy($image2);
}

// Main entry point
try {
    // Parse command-line arguments
    $args = json_decode($argv[1], true);

    // Call the function with the provided arguments
    compareImages($args[0], $args[1], $args[2]);
} catch (Exception $e) {
    // Output any errors that occur
    echo $e->getMessage();
    exit(1);
}
```

<br>
So now that we have the new file and we are no longer dependend on the mapbox/pixelmatch package, we need to add the functionality to create an image based on the mismatched pixels from the comparing images.

In the src folder there are 2 files that we change to be able to work with our new pixelmatchWE.php file
<br>

<h3>Original Pixelmatch file:</h3>


```php
<?php

namespace Spatie\Pixelmatch;

use Spatie\Pixelmatch\Exceptions\CouldNotCompare;
use Spatie\Pixelmatch\Exceptions\InvalidImage;
use Spatie\Pixelmatch\Exceptions\InvalidThreshold;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

class Pixelmatch
{
    protected string $workingDirectory;

    /*
     * If true, we'll ignore anti-aliased pixels
     */
    protected bool $includeAa = false;

    /*
     * Smaller values make the comparison more sensitive
     */
    protected float $threshold = 0.1;

    protected string $fileDir = 'bin/';

    protected string $filename = 'pixelmatch.js';

    protected function __construct(
        public string $pathToImage1,
        public string $pathToImage2,
    ) {
        $this->workingDirectory = (string) realpath(dirname(__DIR__));

        $this->ensureValidImages();
    }

    protected function ensureValidImages(): void
    {
        $paths = [$this->pathToImage1, $this->pathToImage2];

        foreach ($paths as $filePath) {
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);

            if (! file_exists($filePath)) {
                throw InvalidImage::doesNotExist($filePath);
            }

            if (strtolower($extension) !== 'png') {
                throw InvalidImage::invalidFormat($filePath);
            }
        }
    }

    public static function new(string $pathToImage1, string $pathToImage2): self
    {
        return new static($pathToImage1, $pathToImage2);
    }

    public function includeAa(bool $includeAa = true): self
    {
        $this->includeAa = $includeAa;

        return $this;
    }

    public function threshold(float $threshold): self
    {
        if ($threshold > 1 || $threshold < 0) {
            throw InvalidThreshold::make($threshold);
        }

        $this->threshold = $threshold;

        return $this;
    }

    /** @return array<string, mixed> */
    public function options(): array
    {
        $options = [];

        if (isset($this->includeAa)) {
            $options['includeAA'] = $this->includeAa;
        }

        if (isset($this->threshold)) {
            $options['threshold'] = $this->threshold;
        }

        return $options;
    }

    public function matchedPixelPercentage(): float
    {
        return $this->getResult()->matchedPixelPercentage();
    }

    public function mismatchedPixelPercentage(): float
    {
        return $this->getResult()->mismatchedPixelPercentage();
    }

    public function matchedPixels(): int
    {
        return $this->getResult()->matchedPixels();
    }

    public function mismatchedPixels(): int
    {
        return $this->getResult()->mismatchedPixels();
    }

    public function matches(): bool
    {
        return $this->getResult()->matches();
    }

    public function doesNotMatch(): bool
    {
        return $this->getResult()->doesNotMatch();
    }

    public function getResult(): PixelmatchResult
    {
        $arguments = [
            'imagePath1' => $this->pathToImage1,
            'imagePath2' => $this->pathToImage2,
            'options' => [
                'includeAA' => $this->includeAa,
                'threshold' => $this->threshold,
            ],
        ];

        $process = new Process(
            command: $this->getCommand($arguments),
            cwd: $this->workingDirectory,
        );

        $process->run();

        if (! $process->isSuccessful()) {
            if (str_contains($process->getErrorOutput(), 'Image sizes do not match')) {
                throw CouldNotCompare::imageDimensionsDiffer(
                    $this->pathToImage1,
                    $this->pathToImage2
                );
            }

            throw new ProcessFailedException($process);
        }

        $result = $process->getOutput();

        return PixelmatchResult::fromString($result);
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<int, string|false|null>
     */
    protected function getCommand(array $arguments): array
    {
        return [
            (new ExecutableFinder())->find('node', 'node', [
                '/usr/local/bin',
                '/opt/homebrew/bin',
            ]),
            $this->fileDir.$this->filename,
            json_encode(array_values($arguments)),
        ];
    }
}
```
<br>

### Reworked Pixelmatch file:
```php
<?php

namespace WE\Pixelmatch;

use WE\Pixelmatch\Exceptions\CouldNotCompare;
use WE\Pixelmatch\Exceptions\InvalidImage;
use WE\Pixelmatch\Exceptions\InvalidThreshold;
use Symfony\Component\Process\Exception\ProcessFailedException as ExceptionProcessFailedException;
use Symfony\Component\Process\Process;
use WE\Pixelmatch\PixelmatchResultWE;

class PixelmatchWE
{
    protected string $workingDirectory;

    /**
     * If true, we'll ignore anti-aliased pixels
     */
    protected bool $includeAa = false;

    /**
     * Smaller values make the comparison more sensitive
     */
    protected float $threshold = 0.1;

    protected string $fileDir = 'bin/';

    protected string $filename = 'pixelmatchWE.php';

    protected function __construct(
        public string $pathToImage1,
        public string $pathToImage2,
        public string $outputPath,
    ) {
        $this->workingDirectory = (string) realpath(dirname(__DIR__));

        $this->ensureValidImages();
    }

    protected function ensureValidImages(): void
    {
        $paths = [$this->pathToImage1, $this->pathToImage2];

        foreach ($paths as $filePath) {
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);

            if (! file_exists($filePath)) {
                throw InvalidImage::doesNotExist($filePath);
            }

            if (strtolower($extension) !== 'png') {
                throw InvalidImage::invalidFormat($filePath);
            }
        }
    }

    public static function new(string $pathToImage1, string $pathToImage2, string $outputPath): self
    {
        return new static($pathToImage1, $pathToImage2, $outputPath);
    }

    public function includeAa(bool $includeAa = true): self
    {
        $this->includeAa = $includeAa;

        return $this;
    }

    public function threshold(float $threshold): self
    {
        if ($threshold > 1 || $threshold < 0) {
            throw InvalidThreshold::make($threshold);
        }

        $this->threshold = $threshold;

        return $this;
    }

    /** @return array<string, mixed> */
    public function options(): array
    {
        $options = [];

        if (isset($this->includeAa)) {
            $options['includeAA'] = $this->includeAa;
        }

        if (isset($this->threshold)) {
            $options['threshold'] = $this->threshold;
        }

        return $options;
    }

    public function matchedPixelPercentage(): float
    {
        return $this->getResult()->matchedPixelPercentage();
    }

    public function mismatchedPixelPercentage(): float
    {
        return $this->getResult()->mismatchedPixelPercentage();
    }

    public function matchedPixels(): int
    {
        return $this->getResult()->matchedPixels();
    }

    public function mismatchedPixels(): int
    {
        return $this->getResult()->mismatchedPixels();
    }

    public function matches(): bool
    {
        return $this->getResult()->matches();
    }

    public function doesNotMatch(): bool
    {
        return $this->getResult()->doesNotMatch();
    }

    public function mismatchedPixelsX(): array
    {
        return $this->getResult()->mismatchedPixelsX();
    }

    public function mismatchedPixelsY(): array
    {
        return $this->getResult()->mismatchedPixelsY();
    }

    public function generateDiffImage()
    {
        return $this->getResult()->generateDiffImage();
    }

    public function getResult(): PixelmatchResultWE
    {
        $arguments = [
            'imagePath1' => $this->pathToImage1,
            'imagePath2' => $this->pathToImage2,
            'outputPath' => $this->outputPath,
            'options' => [
                'includeAA' => $this->includeAa,
                'threshold' => $this->threshold,
            ],
        ];

        $process = new Process(
            command: $this->getCommand($arguments),
            cwd: $this->workingDirectory,
        );

        $process->run();

        if (! $process->isSuccessful()) {
            if (str_contains($process->getErrorOutput(), 'Image sizes do not match')) {
                throw CouldNotCompare::imageDimensionsDiffer(
                    $this->pathToImage1,
                    $this->pathToImage2
                );
            }

            throw new ExceptionProcessFailedException($process);
        }

        $result = $process->getOutput();

        return PixelmatchResultWE::fromString($result);
    }

    /**
     * @param array<string, mixed> $arguments
     * @return array<int, string|false|null>
     */
    protected function getCommand(array $arguments): array
    {
        return [
            PHP_BINARY,
            $this->fileDir.$this->filename,
            json_encode(array_values($arguments)),
        ];
    }
}
```
<br>

### Original PixelmatchResult file:
```php
<?php

namespace Spatie\Pixelmatch;

class PixelmatchResult
{
    public function __construct(
        protected int $mismatchedPixels,
        protected int $width,
        protected int $height,
    ) {
    }

    public static function fromString(string $jsonString): self
    {
        $properties = json_decode($jsonString, true);

        return new self(
            $properties['mismatchedPixels'],
            $properties['width'],
            $properties['height'],
        );
    }

    public function width(): int
    {
        return $this->width;
    }

    public function height(): int
    {
        return $this->height;
    }

    public function totalPixels(): int
    {
        return $this->width * $this->height;
    }

    public function mismatchedPixels(): int
    {
        return $this->mismatchedPixels;
    }

    public function matchedPixels(): int
    {
        return $this->totalPixels() - $this->mismatchedPixels();
    }

    public function matchedPixelPercentage(): float
    {
        return ($this->matchedPixels() / $this->totalPixels()) * 100;
    }

    public function mismatchedPixelPercentage(): float
    {
        return 100 - $this->matchedPixelPercentage();
    }

    public function matches(): bool
    {
        return $this->mismatchedPixels() === 0;
    }

    public function doesNotMatch(): bool
    {
        return ! $this->matches();
    }
}

```
<br>

### Reworked PixelmatchResultWE file:
```php
<?php

namespace WE\Pixelmatch;

class PixelmatchResultWE
{
    protected array $mismatchedPixelsX;
    protected array $mismatchedPixelsY;

    public function __construct(
        protected string $mismatchedPixels,
        protected string $width,
        protected string $height,
        array $mismatchedPixelsX,
        array $mismatchedPixelsY,
        protected string $outputPath,
    ) {
        $this->mismatchedPixelsX = $mismatchedPixelsX;
        $this->mismatchedPixelsY = $mismatchedPixelsY;
    }

    public static function fromString(string $jsonString): self
    {
        $properties = json_decode($jsonString, true);

        return new self(
            $properties['mismatchedPixels'],
            $properties['width'],
            $properties['height'],
            $properties['mismatchedPixelsX'],
            $properties['mismatchedPixelsY'],
            $properties['outputPath']
        );
    }

    public function width(): int
    {
        return $this->width;
    }

    public function height(): int
    {
        return $this->height;
    }

    public function totalPixels(): int
    {
        return $this->width * $this->height;
    }

    public function mismatchedPixels(): int
    {
        return $this->mismatchedPixels;
    }

    public function mismatchedPixelsX(): array 
    {
        return $this->mismatchedPixelsX;
    }

    public function mismatchedPixelsY(): array
    {
        return $this->mismatchedPixelsY;
    }

    public function matchedPixels(): int
    {
        return $this->totalPixels() - $this->mismatchedPixels();
    }

    public function matchedPixelPercentage(): float
    {
        return ($this->matchedPixels() / $this->totalPixels()) * 100;
    }

    public function mismatchedPixelPercentage(): float
    {
        return 100 - $this->matchedPixelPercentage();
    }

    public function matches(): bool
    {
        return $this->mismatchedPixels() === 0;
    }

    public function doesNotMatch(): bool
    {
        return ! $this->matches();
    }

    public function generateDiffImage()
    {
        $width = $this->width;
        $height = $this->height;
    
        // Create a blank diff image
        $diffImage = imagecreatetruecolor($width, $height);
        if (!$diffImage) {
            return false;
        }
    
        $red = imagecolorallocate($diffImage, 255, 0, 0); // Allocate red color
        $white = imagecolorallocate($diffImage, 255, 255, 255); // Allocate white color
        imagefill($diffImage, 0, 0, $white); // Fill the diff image with white
    
        // Draw mismatchedPixels on the diff image in red
        $numMismatchedPixels = count($this->mismatchedPixelsX);
    
        for ($i = 0; $i < $numMismatchedPixels; $i++) {
            $x = $this->mismatchedPixelsX[$i];
            $y = $this->mismatchedPixelsY[$i];
    
            // Set the mismatched pixels to red
            imagesetpixel($diffImage, $x, $y, $red);
        }
    
        return imagepng($diffImage, $this->outputPath);
    }
}
```
<br>

In the reworked file, we can see an extra function called `generateDiffImage`. In this function, we start by creating a new image using the width and height from the original image. We then check to see if the image has been successfully created. If it hasn't been properly created, we return out of the function. After this check, we create two colors: red and white. We will use the red color to indicate where pixels are mismatched in the comparison images. The color white will be used for the background for the diff image. Then we count the number of mismatched pixels based on the value stored in the variable `mismatchedPixelsX`. We could also count the value of the variable `mismatchedPixelsY` because they are the same. This is due to the fact that the image is 2D, and thus each pixel needs an X coordinate and a Y coordinate. Then we loop over the number of pixels needed to draw and fill the pixels with the color red based on their X and Y values.

<br>
<h2 align="left" id="testing" style="color: #ff0029;">Testing</h2>

Now that the file has been reworked we can call the function almost in the same way as before. 

Before we had a test class made like this:
```php
<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use Spatie\Pixelmatch\Pixelmatch;

class PixelMatchTest extends TestCase
{
    private $folderItemCount; // Declaring $folderItemCount as a Class-level array.

    /**
     * Check if the folders that are needed exist.
     * If they don't exist fail the test and give a message to the user.
     * All screenshot that have been made are stored in an folder that contains: "browsershotImages".
     * 
     * @return void 
     */
    public function testFolderExists(): void
    {
        $this->folderItemCount = [];
        $files = scandir(__DIR__);

        foreach ($files as $file) {
            if (strpos($file, 'browsershotImages') !== false) {
                $folderPath = __DIR__ . "/" . $file;
                $this->folderItemCount[$file] = count(scandir($folderPath)) - 2;
            }
        }

        foreach ($this->folderItemCount as $folder => $count) {
            $this->assertFileExists(__DIR__ . "/" . $folder);
        }

        $this->pixelMatch();
    }

    /**
     * Run the PixelMatch test based on the folders that are verified before
     * 
     * @return void
     */
    public function pixelMatch(): void
    {
        $folderNames = array_keys($this->folderItemCount);
        $numFolders = count($folderNames);

        // Ensure we have at least two folders to compare
        if ($numFolders < 2) {
            return; // Not enough folders to compare, exit the function
        }

        // Iterate over pairs of folders
        for ($i = 0; $i < $numFolders - 1; $i++) {
            $folderA = $folderNames[$i];
            $folderB = $folderNames[$i + 1];

            $countA = $this->folderItemCount[$folderA];
            $countB = $this->folderItemCount[$folderB];

            // Determine the maximum number of images to compare between the two folders
            $maxImages = min($countA, $countB);

            // Compare images between folder A and folder B
            for ($j = 0; $j < $maxImages; $j++) {
                $pixelmatch = Pixelmatch::new(__DIR__ . "/" . $folderA . "/image" . $j . ".png", __DIR__ . "/" . $folderB . "/image" . $j . ".png");

                $result = $pixelmatch->getResult()->matchedPixelPercentage();

                $this->createLog($result, $folderA, $folderB, $j);
                $this->assertEquals($result, 100);
            }
        }
    }

    /**
     * Print logging file based on the test results
     * 
     * @return void
     */
    public function createLog($result, $folderA, $folderB, $j): void
    {
        // Create the Log$currDateTime.txt and fill it with the $result 
        $currDateTime = date("N-m-Y-H:i:s", strtotime('+1 hour'));
        $logContent = "Image" . $j . ".png from " . $folderA . " and " . $folderB . " match: " . $result . "%";
        file_put_contents("Log" . $currDateTime . ".txt", $logContent . PHP_EOL, FILE_APPEND);
    }
}
```

<br>
In the new test class it goes a little different because of the changes we made

```php
<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use WE\Pixelmatch\PixelmatchWE;

class PixelmatchTest extends TestCase
{
    // Declaring $folderItem as a class level variable
    private $folderItemCount;

    public function testFolderExists(): void
    {
        $this->folderItemCount = [];
        $files = scandir(__DIR__);

        foreach ($files as $file) {
            if (strpos($file, 'browsershotImages') !== false) {
                $folderPath = __DIR__ . "/" . $file;
                $this->folderItemCount[$file] = count(scandir($folderPath)) - 2;
            }

            if (strpos($file, 'DiffImages') !== true) {
                mkdir(__DIR__ . "/DiffImages",0777,true);
            }
        }

        foreach ($this->folderItemCount as $folder => $count) {
            $this->assertFileExists(__DIR__ . "/" . $folder);
        }

        $this->pixelMatch();
    }

    public function pixelMatch(): void
    {
        $folderNames = array_keys($this->folderItemCount);
        $numFolders = count($folderNames);

        // Ensure we have at least two folders to compare
        if ($numFolders < 2) {
            return; // Not enough folders to compare, exit the function
        }

        // Iterate over pairs of folders
        for ($i = 0; $i < $numFolders; $i++) {
            $folderA = $folderNames[$i];
            $folderB = $folderNames[$i + 1];

            $countA = $this->folderItemCount[$folderA];
            $countB = $this->folderItemCount[$folderB];

            // Determine the maximum number of images to compare between the two folders
            $maxImages = min($countA, $countB);

            for ($j = 0; $j < $maxImages; $j++) {
                $pixelmatch = PixelmatchWE::new(__DIR__ . "/" . $folderA . "/" . $j . "b.png", __DIR__ . "/" . $folderB . "/" . $j . "a.png", __DIR__ . "/DiffImages/" . $j . "Diff.png");

                $pixelmatch->getResult()->generateDiffImage();
                $result = $pixelmatch->getResult()->matchedPixelPercentage();

                $this->assertFileExists(__DIR__ . "/DiffImages/" . $j . "Diff.png");
                print_r($result, true);
            }
        }
    }
}
```

<br>

In the new test file we have no `createLog` function because we generate a `DiffImage`. Now we need to also check for the output folder we want to store our `DiffImage` in. And we call upon the `PixelmatchWE` class instead of the `Pixelmatch` class. Because the new package is still a work in progress we need to use the `require_once` for the classes to properly load. When this is fixed the docs will be changed accordingly.