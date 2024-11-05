function MapXLabel(result) {
  var firstName = result.participant.firstName;
  var placement = result.participant.eventPlacement;

  var icon = "";

  if (placement === 1) {
    icon = "🥇";
  } else if (placement === 2) {
    icon = "🥈";
  } else if (placement === 3) {
    icon = "🥉";
  }

  return `${firstName} ${icon}`;
}

export const ScoreboardHelper = {
  MapXLabel: MapXLabel,
};
