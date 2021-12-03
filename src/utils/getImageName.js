export default function getName(path, seprator = "category-images%2F") {
  const imageName = path.split(seprator)[1]?.split("?")[0];
  return imageName;
}
