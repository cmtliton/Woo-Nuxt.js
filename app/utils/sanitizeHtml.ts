/**
 * Sanitize HTML content to prevent XSS attacks
 * Allows safe tags commonly used in product descriptions
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";

  const element = document.createElement("div");
  element.innerHTML = html;

  // Define allowed tags
  const allowedTags = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "blockquote",
  ];
  const allowedAttributes: { [key: string]: string[] } = {
    a: ["href", "title", "target"],
    img: ["src", "alt", "title", "width", "height"],
  };

  const sanitizeNode = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      if (!allowedTags.includes(tagName)) {
        // Remove disallowed tags but keep content
        while (element.firstChild) {
          element.parentNode?.insertBefore(element.firstChild, element);
        }
        element.parentNode?.removeChild(element);
      } else {
        // Remove disallowed attributes
        const allowedAttrs = allowedAttributes[tagName] || [];
        const attributesToRemove: string[] = [];

        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes.item(i);
          if (attr && !allowedAttrs.includes(attr.name)) {
            attributesToRemove.push(attr.name);
          }
        }

        attributesToRemove.forEach((attr) => element.removeAttribute(attr));

        // Sanitize href in links to prevent javascript: attacks
        if (tagName === "a" && element.hasAttribute("href")) {
          const href = element.getAttribute("href");
          if (href?.startsWith("javascript:") || href?.startsWith("data:")) {
            element.removeAttribute("href");
          }
        }

        // Process child nodes
        const childNodes = Array.from(element.childNodes);
        childNodes.forEach(sanitizeNode);
      }
    }
  };

  const childNodes = Array.from(element.childNodes);
  childNodes.forEach(sanitizeNode);

  return element.innerHTML;
};
