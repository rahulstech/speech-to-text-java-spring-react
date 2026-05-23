export default function HistoryItem({ history }) {

    return (
        <div key={history.id}>
            <audio src={history.audioFile} controls />
            <p>{history.transcript}</p>
            <span>{history.createdAt}</span>
        </div>
    )
}