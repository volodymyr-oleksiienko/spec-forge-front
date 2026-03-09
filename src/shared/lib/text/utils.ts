export const convertHtmlToText = (html: string) => {
  return html.replace(/<[^>]+>/g, '');
};
