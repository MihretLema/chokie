import sanitizeHtml from 'sanitize-html';
export function safeRichText(text:string){return sanitizeHtml(text,{allowedTags:['p','h2','h3','ul','ol','li','strong','em','br','a','blockquote'],allowedAttributes:{a:['href','title']},allowedSchemes:['http','https'],allowProtocolRelative:false,transformTags:{a:sanitizeHtml.simpleTransform('a',{rel:'noopener noreferrer'})}});}
export function plainText(text:string){return sanitizeHtml(text,{allowedTags:[],allowedAttributes:{}}).trim();}
