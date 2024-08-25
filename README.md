# DataUploadToIPFS

Satyam Mehta 21115087
This is my Minor project which utilises IPFS storage to store text and file data.The frontend is devloped on React.js and backend is based on Node.js. we will need `npm` in order to run this on machine.

# Installation

Install [Ifps Desktop](https://docs.ipfs.tech/install/ipfs-desktop/) or use Chocolatey `choco install ipfs-desktop`<br/>
after installation make sure the settings of IPFS desktop looks like this
![image](https://i.ibb.co/Ky5xRBg/NVIDIA-Share-T9gz-MTLmm5.png) <br/>
clone this repo

```
git clone https://github.com/merepapa/IPFS-Uploading.git
```

```
npm install
```

```
cd server
```

```
npm install
```

# running the program

while in `\IPFS-Storage\Server`
run this command.

```
node server.js
```

then open new terminal in the `\IPFS-Storage` directory and run

```
npm run dev
```

to see the files that have been uploaded you can open `public\server.html` too see the list of files.
