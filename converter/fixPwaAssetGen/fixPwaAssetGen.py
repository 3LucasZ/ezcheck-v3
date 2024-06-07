inputFile = "converter/fixPwaAssetGen/in.html"
outputFile = "converter/fixPwaAssetGen/out.html"

outputBuffer = open(outputFile, "w").close() #first, wipe the file
outputBuffer = open(outputFile, "a") #now we can append to it :)
inputBuffer = open(inputFile, "r").read()

ret = inputBuffer.replace("public","")
outputBuffer.write(ret)
outputBuffer.close()



