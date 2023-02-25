export const addClass = (ele, cls) => {
  let clsName = ele.className,
    blank = clsName != '' ? ' ' : '';
  ele.className = `${clsName}${blank}${cls}`;
};

export const removeClass = (ele, cls) => {
  let clsName = ' ' + ele.className + ' ';
  clsName = clsName.replace(/(\s+)/gi, ' ');
  let removed = clsName.replace(' ' + cls + ' ', ' ');
  removed = removed.replace(/(^\s+)|(\s+$)/g, '');
  ele.className = removed;
};

export const hasClass = (ele, cls) => {
  let clsNameList = ele.className.split(/\s+/);

  return clsNameList.includes(cls) ? true : false;
};
