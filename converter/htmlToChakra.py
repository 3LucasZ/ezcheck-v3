inputFile = "converter/in.html"
outputFile = "converter/out.tsx"

delimeter1 = ["<","</"]
# delimeter2 = [">",">"]
delimeter2 = ["",""]
mapper = {
    "h1":["Heading size='2xl'","Heading"],
    "h2":["Heading size='xl'","Heading"],
    "h3":["Heading size='lg'","Heading"],
    "h4":["Heading size='md'","Heading"],
    "h5":["Heading size='sm'","Heading"],
    "p":["Text","Text"],
    "a":["Link","Link"],
    "ul":["UnorderedList","UnorderedList"],
    "li":["ListItem","ListItem"]
}

outputBuffer = open(outputFile, "w").close() #first, wipe the file
outputBuffer = open(outputFile, "a") #now we can append to it :)
inputBuffer = open(inputFile, "r").read()

outputBuffer.write('import { Heading, Text, Link, UnorderedList, ListItem, Box } from "@chakra-ui/react" \n')
outputBuffer.write('export default function Home() { \n')
outputBuffer.write('return <Box p="8"> \n')
for i in range(2):
    for j in mapper:
        inputBuffer = inputBuffer.replace(delimeter1[i]+j+delimeter2[i],delimeter1[i]+mapper[j][i]+delimeter2[i])
outputBuffer.write(inputBuffer)
outputBuffer.write('</Box> \n')
outputBuffer.write('} \n')
outputBuffer.close()



# lines = inputBuffer.splitlines()

# for line in lines:
#     for i in range(2):
#         split = line.split(delimeter1[i])
#         if (len(split)==2):
#             htmlElement = split[1].split(delimeter2[i])[0]
#             if (htmlElement in mapper): line = line.replace(delimeter1[i]+htmlElement+delimeter2[i],delimeter1[i]+mapper[htmlElement][i]+delimeter2[i])
#     outputBuffer.write(line+"\n")
