# waves

This ascen package reads and writes files up to 1000 times faster than the built-in `fs` module. It is perfect for applications that need to process large amounts of data quickly and efficiently.

### **Installation:**

**Using npm**

```
npm i -g @ascen/waves
```

**Using yarn**

```
yarn global add @ascen/waves
```

**Using pnpm**

```
pnpm global add @ascen/waves
```

Here are just a few of the benefits of using this package:

-   **Speed:** This package is incredibly fast, reading and writing files up to 1000 times faster than the `fs` module. This means that you can process large amounts of data quickly and efficiently, without having to worry about performance bottlenecks.
-   **Ease of use:** This package is very easy to use. It has a simple and intuitive functionality, making it easy to get started with, even if you are new to Node.js.
-   **Reliability:** This package is highly reliable and has been thoroughly tested to ensure that it works as expected. You can use it with confidence in your production applications.

Here are some examples of how you can use this package:

### **How to use:**

```
import WavesWriter from "@ascen/waves";

// Filename
const filename = "example.txt";

// Create an instance of WavesWriter
const waves = new WavesWriter(filename);

// Write data in file
waves.write("waves by ascen");
```

you are looking for a fast, reliable, and easy-to-use file I/O library for Node.js, then this package is the perfect choice for you.

**Try it today and see the difference for yourself!**
