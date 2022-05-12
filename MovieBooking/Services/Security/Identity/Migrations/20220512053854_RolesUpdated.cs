using Microsoft.EntityFrameworkCore.Migrations;

namespace Identity.Migrations
{
    public partial class RolesUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "8d43a5d6-ef73-4c24-9e58-6bbcbd35333c");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "c6ec26f5-b482-4a21-9b64-d7c58e01eeb2");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "03a2df93-e267-457d-b449-e840f6175489", "2a253837-bd6c-4144-8318-21db86aa9e40", "Customer", "CUSTOMER" });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "75ee57b0-09a0-4e3d-a5cb-8e8795a88a7a", "a8000adc-561c-455b-86c7-9d0ff6e60e7a", "Admin", "ADMIN" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "03a2df93-e267-457d-b449-e840f6175489");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "75ee57b0-09a0-4e3d-a5cb-8e8795a88a7a");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "8d43a5d6-ef73-4c24-9e58-6bbcbd35333c", "61ec272a-8f83-4077-974f-703d0748dcfd", "Customer", null });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "c6ec26f5-b482-4a21-9b64-d7c58e01eeb2", "1235a274-f6b6-4875-8ad6-8785aa53b50e", "Admin", null });
        }
    }
}
