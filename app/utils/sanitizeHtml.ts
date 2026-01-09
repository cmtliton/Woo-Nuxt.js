/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";

  // ১. চেক করুন এটি সার্ভার সাইড কি না। সার্ভারে 'document' থাকে না।
  if (import.meta.server || typeof document === "undefined") {
    // সার্ভার সাইডে আমরা ব্রাউজার DOM ব্যবহার করতে পারবো না।
    // এখানে আপনি চাইলে ডেসক্রিপশন সরাসরি রিটার্ন করতে পারেন অথবা
    // সিম্পল মেটা ডেটা হিসেবে প্লেইন টেক্সট দিতে পারেন।
    return html;
  }

  // ২. ক্লায়েন্ট সাইড (Browser) লজিক
  const element = document.createElement("div");
  element.innerHTML = html;

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
    // এখানে Node.TEXT_NODE ব্রাউজারে পাওয়া যাবে
    if (node.nodeType === 3) {
      // 3 = Node.TEXT_NODE
      return;
    }

    if (node.nodeType === 1) {
      // 1 = Node.ELEMENT_NODE
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      if (!allowedTags.includes(tagName)) {
        while (el.firstChild) {
          el.parentNode?.insertBefore(el.firstChild, el);
        }
        el.parentNode?.removeChild(el);
      } else {
        const allowedAttrs = allowedAttributes[tagName] || [];
        const attrs = Array.from(el.attributes);

        attrs.forEach((attr) => {
          if (!allowedAttrs.includes(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });

        if (tagName === "a" && el.hasAttribute("href")) {
          const href = el.getAttribute("href");
          if (href?.startsWith("javascript:") || href?.startsWith("data:")) {
            el.removeAttribute("href");
          }
        }

        const children = Array.from(el.childNodes);
        children.forEach(sanitizeNode);
      }
    }
  };

  const childNodes = Array.from(element.childNodes);
  childNodes.forEach(sanitizeNode);

  return element.innerHTML;
};
