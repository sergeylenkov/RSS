export function removeSelfLinks(description: string, link: string): string {
  const element = document.createElement('div');
  element.innerHTML = description;

  const items = Array.from(element.getElementsByTagName('a'));

  const links = items.filter((item) => {
    const href = item.getAttribute('href');

    return !!(href && href.indexOf(link) !== -1);
  });

  links.forEach(el => el.remove());

  return element.innerHTML;
}

export function isLong(description: string): boolean {
  const element = document.createElement('div');
  element.innerHTML = description;

  if (element.getElementsByTagName('img').length > 3) {
    return true;
  }

  if (element.textContent) {
    return element.textContent.length > 1500;
  }

  return false;
}