import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'projects');

export function getProjects() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {

    const id = fileName.replace(/\.json$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const rawdata = fs.readFileSync(fullPath, 'utf8');
    const fileContents = JSON.parse(rawdata);

    return {
      id,
      ...fileContents,
    };
  });

  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getProjectIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.json$/, ''),
      },
    };
  });
}

export function getProject(id) {
  const fullPath = path.join(postsDirectory, `${id}.json`);
  const rawdata = fs.readFileSync(fullPath, 'utf8');
  const project = JSON.parse(rawdata);

  return {
    id,
    ...project,
  };
}

