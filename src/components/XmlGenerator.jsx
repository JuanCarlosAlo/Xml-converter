
const XmlGenerator = ({ xmlContent, onGenerateXml, onDownloadXml, loading, error }) => {
    return (
        <div>
          <button onClick={onGenerateXml} disabled={loading}>
            {loading ? 'Generating...' : 'Generate XML'}
          </button>
          {xmlContent && (
            <div>
              <button onClick={onDownloadXml}>Download XML</button>
            </div>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      );
}

export default XmlGenerator