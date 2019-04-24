
import os
import shutil
import urllib.request
import urllib.parse
import errno
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
URL = 'https://api.telegram.org/file/bot809267466:AAEvKpXwESa4J_FUAgr1C0DDlbcyI00Etc4/photos/file_9.jpg'
nameFolder = 'Nazarii_Banakh'

# define the name of the directory to be created
path = "photos/" + nameFolder

def createFolder(directory):
    try:
        if not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise
        print('Error: Creating directory. ' + directory)


def removeFolder(directory):
    try:
        shutil.rmtree(directory, ignore_errors=True)
    except OSError:
        print("Deletion of the directory %s failed" % directory)
    else:
        print("Successfully deleted the directory %s" % directory)

createFolder(path)
#removeFolder(path)

# Download file and save in directory
with urllib.request.urlopen(URL) as url:
    s = url.read()

split = urllib.parse.urlsplit(URL)
filename = path + '/' +split.path.split("/")[-1]

urllib.request.urlretrieve(URL, filename)


