using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.Migrations
{
    public partial class compositeIndices : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Results_ActivityId_ParticipantId",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Participants_EventId",
                table: "Participants");

            migrationBuilder.DropIndex(
                name: "IX_Activities_EventId",
                table: "Activities");

            migrationBuilder.CreateIndex(
                name: "IX_Results_ActivityId_Id",
                table: "Results",
                columns: new[] { "ActivityId", "Id" },
                unique: true)
                .Annotation("SqlServer:Clustered", false);

            migrationBuilder.CreateIndex(
                name: "IX_Results_ActivityId_ParticipantId",
                table: "Results",
                columns: new[] { "ActivityId", "ParticipantId" },
                unique: true)
                .Annotation("SqlServer:Clustered", false);

            migrationBuilder.CreateIndex(
                name: "IX_Participants_EventId_Id",
                table: "Participants",
                columns: new[] { "EventId", "Id" },
                unique: true)
                .Annotation("SqlServer:Clustered", false);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_EventId_Id",
                table: "Activities",
                columns: new[] { "EventId", "Id" },
                unique: true)
                .Annotation("SqlServer:Clustered", false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Results_ActivityId_Id",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Results_ActivityId_ParticipantId",
                table: "Results");

            migrationBuilder.DropIndex(
                name: "IX_Participants_EventId_Id",
                table: "Participants");

            migrationBuilder.DropIndex(
                name: "IX_Activities_EventId_Id",
                table: "Activities");

            migrationBuilder.CreateIndex(
                name: "IX_Results_ActivityId_ParticipantId",
                table: "Results",
                columns: new[] { "ActivityId", "ParticipantId" })
                .Annotation("SqlServer:Clustered", false);

            migrationBuilder.CreateIndex(
                name: "IX_Participants_EventId",
                table: "Participants",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_EventId",
                table: "Activities",
                column: "EventId");
        }
    }
}
