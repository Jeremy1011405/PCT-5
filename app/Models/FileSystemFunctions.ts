import {knownFolders, Folder, File, path} from '@nativescript/core';

export function WriteFile(FileContent: any, FolderName: string, FileName: string)
//Create a JSON file. If Folder and File do not exist it creates them.
//If File does exist it gets overwritten.
//This function must run before ReadFile(-sync) for those functions to work
//Returns FileContent. This is for checking if the file has the correct FileContent. 
        {
            const documents : Folder =<Folder>knownFolders.documents();
            const folder: Folder = <Folder>documents.getFolder(FolderName);
            const file: File = <File>folder.getFile(FileName);
            
            file.writeText(FileContent);
            return FileContent;
        }


export function ReadFile(FolderName: string, FileName: string): string
//Read a JSON file. This can run ASYNC(Does not run at the same time as the rest of the code). 
//Pages can load before this is done.
//ReadFile only works if the file it tries to read is made with WriteFile
//Returns JSONcontent for later use.
        {
            const documents : Folder =<Folder>knownFolders.documents();
            const folder: Folder = <Folder>documents.getFolder(FolderName);
            const file: File = <File>folder.getFile(FileName);
            var JSONstring: string = "";
            file.readText()
            .then((res) => {
                console.log("File content:")
                console.log(res)
                JSONstring = res;
                
            }
            )
            .catch((err) => {
            console.log("Error:")
            console.log(err.stack)
            }
            );
            return JSONstring;
        }


export function ReadFileSync(FolderName: string, FileName: string): string
//Read a JSON file. This can run SYNC(Runs at the same time as the rest of the code). 
//Pages can NOT load before this is done.
//ReadFileSync only works if the file it tries to read is made with WriteFile
//Returns JSONcontent for later use.
        {
            const documents : Folder =<Folder>knownFolders.documents();
            const folder: Folder = <Folder>documents.getFolder(FolderName);
            const file: File = <File>folder.getFile(FileName);
            var JSONstring: string = "";
            JSONstring = file.readTextSync()
            return JSONstring;
        }

export function FileExist(FolderName: string, FileName: string): boolean
//Checks if a File exist. Returns a true or false
{
    const documents : Folder =<Folder>knownFolders.documents();
    const folder: Folder = <Folder>documents.getFolder(FolderName);
    const filePath = path.join(folder.path, `${FileName}`);
    const exists = File.exists(filePath);
    console.log(`Does ${FileName} exists: ${exists}`);
    return exists;
}
