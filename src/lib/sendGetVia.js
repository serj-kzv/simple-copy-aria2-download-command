const typeNames = new Map(Object.entries({
    link: 'a',
    image: 'img',
    audio: 'audio',
    video: 'video',
}));
const typeNameLinks = new Map(Object.entries({
    link: 'href',
    image: 'src',
    audio: 'src',
    video: 'src',
}));

const sendGetVia = (mediaType, url) => {
    typeNames.get(mediaType)
    const element = document.createElement(typeNames.get(mediaType));
    element[typeNameLinks.get(mediaType)] = url;
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export default sendGetVia;