using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Identity.Migrations
{
    public partial class RefreshTokenUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "37d7f11c-1451-4e80-97b5-b6c1d2b11432");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "c09bb8f9-ea69-48f1-b92a-42d60d4bae31");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreationTime",
                table: "RefreshTokens",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Owner",
                table: "RefreshTokens",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "0b283c05-b6af-4fae-a35c-7694077922ec", "cb39d55d-363b-4deb-bc23-66ad19482010", "Customer", "CUSTOMER" });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "11e07f29-1bb2-4f7b-9b6a-7e851769920c", "1e9aaaf2-0737-4075-af61-e88ca7c20e91", "Admin", "ADMIN" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "0b283c05-b6af-4fae-a35c-7694077922ec");

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: "11e07f29-1bb2-4f7b-9b6a-7e851769920c");

            migrationBuilder.DropColumn(
                name: "CreationTime",
                table: "RefreshTokens");

            migrationBuilder.DropColumn(
                name: "Owner",
                table: "RefreshTokens");

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "37d7f11c-1451-4e80-97b5-b6c1d2b11432", "d093145f-e7da-4be1-a088-52c3fb18bce2", "Customer", "CUSTOMER" });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "c09bb8f9-ea69-48f1-b92a-42d60d4bae31", "86afa160-dfcc-4604-a27a-fd394172b6fa", "Admin", "ADMIN" });
        }
    }
}
