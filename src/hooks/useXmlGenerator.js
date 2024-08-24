import { useState } from 'react';
import axios from 'axios';
import * as cheerio from 'cheerio';

export function useXmlGenerator() {
  const [urls, setUrls] = useState(['']);
  const [xmlContent, setXmlContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleUrlChange = (index, event) => {
    const newUrls = [...urls];
    newUrls[index] = event.target.value;
    setUrls(newUrls);
  };

  const handleGenerateXml = async () => {
    setLoading(true);
    setError('');

    try {
      const items = await Promise.all(urls.map(async (url, index) => {
        if (!url) return null;

        try {
          // Usar un proxy para manejar problemas de CORS
          const response = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
          const content = response.data.contents;

          // Parsear el contenido HTML usando cheerio
          const $ = cheerio.load(content);

          // Obtener el nombre de la pestaña a partir del elemento <li class="selected">
          let tabName = $('li.selected').text().trim() || `Página ${index + 1}`;
          
          // Limpiar el nombre de la pestaña para evitar texto duplicado y espacios extra
          tabName = tabName.split('\n').map(line => line.trim()).filter(line => line).shift();

          // Extraer el título SEO y la descripción meta
          const title = $('title').text().trim() || `Página ${index + 1}`;
          const metaDescription = $('meta[name="description"]').attr('content') || `Meta Description de la Página ${index + 1}`;

          return {
            title: tabName,
            link: url,
            pubDate: new Date().toUTCString(),
            creator: 'admin',
            guid: `${url}?p=${index + 1}`,
            description: '',
            content: `<p>Contenido de la Página ${index + 1}</p>`,
            excerpt: '',
            post_id: index + 1,
            post_date: new Date().toISOString(),
            post_date_gmt: new Date().toISOString(),
            comment_status: 'closed',
            ping_status: 'closed',
            post_name: `pagina-${index + 1}`,
            status: 'publish',
            post_parent: 0,
            menu_order: 0,
            post_type: 'page',
            post_password: '',
            is_sticky: 0,
            postmeta: [ 
              { meta_key: '_yoast_wpseo_title', meta_value: title },
              { meta_key: '_yoast_wpseo_metadesc', meta_value: metaDescription }
            ]
          };
        } catch (error) {
          console.error(`Error fetching ${url}: ${error.message}`);
          return null;
        }
      }));

      // Construct the XML manually
      let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
    xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:wfw="http://wellformedweb.org/CommentAPI/"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:wp="http://wordpress.org/export/1.2/">
<channel>
    <title>Sitio</title>
    <link>https://proximedia-server.com/toad/</link>
    <description>Descripción de tu sitio</description>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <language>es</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>https://proximedia-server.com/toad/</wp:base_site_url>
    <wp:base_blog_url>https://proximedia-server.com/toad/</wp:base_blog_url>`;

      // Add items with comments
      items.filter(item => item !== null).forEach((item, index) => {
        xml += `
    <!-- Página ${index + 1} -->
    <item>
        <title>${item.title}</title>
        <link>${item.link}</link>
        <pubDate>${item.pubDate}</pubDate>
        <dc:creator><![CDATA[${item.creator}]]></dc:creator>
        <guid isPermaLink="false">${item.guid}</guid>
        <description>${item.description}</description>
        <content:encoded><![CDATA[${item.content}]]></content:encoded>
        <excerpt:encoded><![CDATA[${item.excerpt}]]></excerpt:encoded>
        <wp:post_id>${item.post_id}</wp:post_id>
        <wp:post_date>${item.post_date}</wp:post_date>
        <wp:post_date_gmt>${item.post_date_gmt}</wp:post_date_gmt>
        <wp:comment_status>${item.comment_status}</wp:comment_status>
        <wp:ping_status>${item.ping_status}</wp:ping_status>
        <wp:post_name></wp:post_name>
        <wp:status>${item.status}</wp:status>
        <wp:post_parent>${item.post_parent}</wp:post_parent>
        <wp:menu_order>${item.menu_order}</wp:menu_order>
        <wp:post_type>${item.post_type}</wp:post_type>
        <wp:post_password>${item.post_password}</wp:post_password>
        <wp:is_sticky>${item.is_sticky}</wp:is_sticky>`;

        item.postmeta.forEach(meta => {
          xml += `
        <wp:postmeta>
            <wp:meta_key>${meta.meta_key}</wp:meta_key>
            <wp:meta_value><![CDATA[${meta.meta_value}]]></wp:meta_value>
        </wp:postmeta>`;
        });

        xml += `
    </item>`;
      });

      xml += `
</channel>
</rss>`;

      setXmlContent(xml);
    } catch (err) {
      setError('Error generating XML');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.xml';
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    urls,
    xmlContent,
    loading,
    error,
    handleAddUrl,
    handleUrlChange,
    handleGenerateXml,
    downloadXml
  };
}
