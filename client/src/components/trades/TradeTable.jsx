import TradeRow from "./TradeRow";

export default function TradeTable({
  trades,
  editingTradeId,
  editFormData,
  onEditClick,
  onDeleteTrade,
  onEditChange,
  onUpdateTrade,
  onCancelEdit,
}) {
  return (
    <table
      border="1"
      cellPadding="10"
      style={{
        marginTop: "20px",
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Direction</th>
          <th>Entry Price</th>
          <th>Exit Price</th>
          <th>Volume</th>
          <th>Profit/Loss</th>
          <th>Strategy</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((trade) => (
          <TradeRow
            key={trade._id}
            trade={trade}
            isEditing={editingTradeId === trade._id}
            editFormData={editFormData}
            onEditClick={onEditClick}
            onDeleteTrade={onDeleteTrade}
            onEditChange={onEditChange}
            onUpdateTrade={onUpdateTrade}
            onCancelEdit={onCancelEdit}
          />
        ))}
      </tbody>
    </table>
  );
}
