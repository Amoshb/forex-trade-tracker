export default function TradeRow({
  trade,
  isEditing,
  editFormData,
  onEditClick,
  onDeleteTrade,
  onEditChange,
  onUpdateTrade,
  onCancelEdit,
}) {
  const profit = Number(trade.profitLoss);

  let rowClass = "";
  if (profit > 0) rowClass = "trade-profit";
  else if (profit < 0) rowClass = "trade-loss";

  if (isEditing) {
    return (
      <tr>
        <td>
          <input
            type="text"
            name="symbol"
            value={editFormData.symbol}
            onChange={onEditChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="direction"
            value={editFormData.direction}
            onChange={onEditChange}
          />
        </td>
        <td>
          <input
            type="number"
            step="0.00001"
            name="openPrice"
            value={editFormData.openPrice}
            onChange={onEditChange}
          />
        </td>
        <td>
          <input
            type="number"
            step="0.00001"
            name="closePrice"
            value={editFormData.closePrice}
            onChange={onEditChange}
          />
        </td>
        <td>
          <input
            type="number"
            step="0.01"
            name="volume"
            value={editFormData.volume}
            onChange={onEditChange}
          />
        </td>
        <td>
          <input
            type="number"
            step="0.01"
            name="profitLoss"
            value={editFormData.profitLoss}
            onChange={onEditChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="strategy"
            value={editFormData.strategy}
            onChange={onEditChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="notes"
            value={editFormData.notes}
            onChange={onEditChange}
          />
        </td>
        <td>
          <div className="trade-action-buttons">
            <button onClick={() => onUpdateTrade(trade._id)}>Save</button>
            <button onClick={onCancelEdit}>Cancel</button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={rowClass}>
      <td>{trade.symbol}</td>
      <td>{trade.direction}</td>
      <td>{trade.openPrice}</td>
      <td>{trade.closePrice}</td>
      <td>{trade.volume}</td>
      <td className={profit > 0 ? "pl-profit" : profit < 0 ? "pl-loss" : ""}>
        {trade.profitLoss}
      </td>
      <td>{trade.strategy}</td>
      <td>{trade.notes}</td>

      <td>
        <div className="trade-action-buttons">
          <button onClick={() => onEditClick(trade)}>Edit</button>
          <button onClick={() => onDeleteTrade(trade._id)}>Delete</button>
        </div>
      </td>
    </tr>
  );
}
