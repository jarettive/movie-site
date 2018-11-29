import os
curr_dir = os.path.dirname(__file__)

streamServices = ["Hulu", "Netflix", "Redbox", "Amazon Prime"]
genres = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Romance"]
content = ["strong violence", "female nudity", "male nudity", "drug abuse"]

def writeArray(fileObj, arr, questFirst, questLast, isLast=False, twoVals=False):
    for i in range(len(arr)):
        item = arr[i]
        fileObj.write("\t{\n")
        fileObj.write("\t\t\"name\" : " + "\"" + item + "\",\n")
        fileObj.write("\t\t\"question\" : " + "\"" + questFirst + item + questLast + "\"\n")
        fileObj.write("\t}")
        if i < len(arr)-1 or not isLast:
            file.write(",")
        file.write("\n")
file_path = os.path.join(curr_dir, "pref-filters.json")
file = open(file_path,"w") 
file.write("[\n")
writeArray(file, streamServices, "Do you use ", " to watch movies?", twoVals=True)
writeArray(file, content, "Will you watch movies with ", "?")
writeArray(file, genres, "Do you watch ", " movies?", True)
file.write("]\n")
file.close()