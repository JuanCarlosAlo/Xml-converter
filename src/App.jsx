import Header from "./components/Header";
import UrlInput from "./components/UrlInput";
import XmlGenerator from "./components/XmlGenerator";
import { useXmlGenerator } from "./hooks/useXmlGenerator";

function App() {
  const {
    urls,
    xmlContent,
    loading,
    error,
    handleAddUrl,
    handleUrlChange,
    handleGenerateXml,
    downloadXml
  } = useXmlGenerator();
  return (
    <>
      
      <UrlInput urls={urls} onUrlChange={handleUrlChange} onAddUrl={handleAddUrl} />
      <XmlGenerator 
        xmlContent={xmlContent}
        onGenerateXml={handleGenerateXml}
        onDownloadXml={downloadXml}
        loading={loading}
        error={error}
      />
    </>
  );
}

export default App;
