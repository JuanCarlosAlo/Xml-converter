const UrlInput = ({ urls, onUrlChange, onAddUrl }) => {
    return (
        <div>
          {urls.map((url, index) => (
            <div key={index}>
              <input
                type="text"
                value={url}
                onChange={(event) => onUrlChange(index, event)}
                placeholder="Enter URL"
              />
              {index === urls.length - 1 && (
                <button onClick={onAddUrl}>Add Another URL</button>
              )}
            </div>
          ))}
        </div>
      );
}

export default UrlInput