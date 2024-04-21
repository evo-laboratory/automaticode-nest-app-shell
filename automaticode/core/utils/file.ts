import { promises as fs } from 'fs';
import * as AutomaticodeJSON from '../../../automaticode.json';
import GDKV1SchemaJSONFile from '../templates/project/gdk-v1-schema-json.file';
import { GDKSchema, GDK_PROPERTY_TYPE } from '../types/generator.type';
import { RESERVED_SCHEMA_NAMES } from '../types/generator.static';

export function CreateSchemaFile(name: string) {
  switch (AutomaticodeJSON.Config.SchemaVersion) {
    case 1:
      const formattedName = name.toLowerCase();
      if (RESERVED_SCHEMA_NAMES.includes(formattedName)) {
        throw new Error(
          `[!] ${name} is reserved word, please enter other name`,
        );
      } else {
        return WriteFile(
          `${AutomaticodeJSON.Config.SchemaFolder}/${formattedName}.json`,
          GDKV1SchemaJSONFile(name),
        );
      }
    default:
      console.log(
        `AutomaticodeJSON.Config.SchemaVersion: ${AutomaticodeJSON.Config.SchemaVersion} not supported.`,
      );
      break;
  }
}

export function CreateDirUnderSrc(dirName: string) {
  const FOLDER_PATH = `src/${dirName}`;
  return fs.mkdir(FOLDER_PATH);
}

export function WriteFile(filePath: string, content: string) {
  return fs.writeFile(filePath, content);
}

export function ReadSchemaDirectoryFileNames() {
  return fs.readdir(AutomaticodeJSON.Config.SchemaFolder);
}

export function ReadGDKDirectoryFileNames() {
  return fs.readdir(AutomaticodeJSON.Config.GDKOutPutFolder);
}

export async function ReadGDKDirectoryFolderNames() {
  try {
    const files = await fs.readdir(AutomaticodeJSON.Config.GDKOutPutFolder);
    const pathCheckList = await Promise.all(
      files.map(async (path) => {
        const stats = await fs.stat(
          `${AutomaticodeJSON.Config.GDKOutPutFolder}/${path}`,
        );
        const isDir = stats.isDirectory();
        return {
          path: path,
          isDir: isDir,
        };
      }),
    );
    return pathCheckList.filter((p) => p.isDir).map((dir) => dir.path);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function ReadSchemaJSONFile(
  jsonName: string,
): Promise<GDKSchema<GDK_PROPERTY_TYPE>> {
  try {
    const fileContent = await fs.readFile(
      `${AutomaticodeJSON.Config.SchemaFolder}/${jsonName}`,
      'utf8',
    );
    return JSON.parse(fileContent);
  } catch (error) {
    console.log('ReadSchemaJSONFile failed');
    console.log(error);
    return Promise.reject(error);
  }
}

export async function CheckDirExist(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      return Promise.reject(error);
    }
  }
}

export async function CheckFileExist(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      return Promise.reject(error);
    }
  }
}

export async function DeleteFile(path: string) {
  return await fs.unlink(`${path}`);
}

export async function RemoveAllFilesUnderDir(path: string) {
  try {
    const files = await fs.readdir(path);
    await Promise.all(
      files.map(async (fileName) => {
        console.log(`${path}/${fileName}`);
        // * Check if is File
        const stats = await fs.stat(`${path}/${fileName}`);
        if (stats.isFile()) {
          return await fs.unlink(`${path}/${fileName}`);
        }
      }),
    );
  } catch (error) {
    return Promise.reject(error);
  }
}
