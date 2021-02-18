﻿// <auto-generated />
using System;
using Arcmage.DAL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Arcmage.DAL.Migrations
{
    [DbContext(typeof(DataBaseContext))]
    [Migration("20210210092221_card_layoutxml")]
    partial class card_layoutxml
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.3")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Arcmage.DAL.Model.CardModel", b =>
                {
                    b.Property<int>("CardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Artist")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Attack")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Cost")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<string>("Defense")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("FactionId")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FlavorText")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Info")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LanguageCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("LastName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LayoutText")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LayoutXml")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Loyalty")
                        .HasColumnType("int");

                    b.Property<string>("MarkdownText")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PngCreationJobId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("RuleSetId")
                        .HasColumnType("int");

                    b.Property<string>("RuleText")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("SerieId")
                        .HasColumnType("int");

                    b.Property<int?>("StatusId")
                        .HasColumnType("int");

                    b.Property<string>("SubType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("TypeCardTypeId")
                        .HasColumnType("int");

                    b.Property<int?>("UserModelUserId")
                        .HasColumnType("int");

                    b.HasKey("CardId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("FactionId");

                    b.HasIndex("LastModifiedById");

                    b.HasIndex("RuleSetId");

                    b.HasIndex("SerieId");

                    b.HasIndex("StatusId");

                    b.HasIndex("TypeCardTypeId");

                    b.HasIndex("UserModelUserId");

                    b.ToTable("CardModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.CardTypeModel", b =>
                {
                    b.Property<int>("CardTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("TemplateInfoId")
                        .HasColumnType("int");

                    b.HasKey("CardTypeId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.HasIndex("TemplateInfoId");

                    b.ToTable("CardTypeModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.DeckCardModel", b =>
                {
                    b.Property<int>("DeckCardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("CardId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<int?>("DeckId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("PdfCreationJobId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Quantity")
                        .HasColumnType("int");

                    b.HasKey("DeckCardId");

                    b.HasIndex("CardId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("DeckId");

                    b.HasIndex("LastModifiedById");

                    b.ToTable("DeckCardModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.DeckModel", b =>
                {
                    b.Property<int>("DeckId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<bool>("ExportTiles")
                        .HasColumnType("bit");

                    b.Property<bool>("GeneratePdf")
                        .HasColumnType("bit");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Pdf")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PdfZipCreationJobId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("StatusId")
                        .HasColumnType("int");

                    b.Property<int?>("UserModelUserId")
                        .HasColumnType("int");

                    b.HasKey("DeckId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.HasIndex("StatusId");

                    b.HasIndex("UserModelUserId");

                    b.ToTable("DeckModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.FactionModel", b =>
                {
                    b.Property<int>("FactionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("FactionId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.ToTable("FactionModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.RoleModel", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RoleId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.ToTable("RoleModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.RuleSetModel", b =>
                {
                    b.Property<int>("RuleSetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("StatusId")
                        .HasColumnType("int");

                    b.HasKey("RuleSetId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.HasIndex("StatusId");

                    b.ToTable("RuleSetModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.SerieModel", b =>
                {
                    b.Property<int>("SerieId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("StatusId")
                        .HasColumnType("int");

                    b.HasKey("SerieId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.HasIndex("StatusId");

                    b.ToTable("SerieModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.StatusModel", b =>
                {
                    b.Property<int>("StatusId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("StatusId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.ToTable("StatusModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.TemplateInfoModel", b =>
                {
                    b.Property<int>("TemplateInfoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("CreatorId")
                        .HasColumnType("int");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("LastModifiedById")
                        .HasColumnType("int");

                    b.Property<DateTime>("LastModifiedTime")
                        .HasColumnType("datetime2");

                    b.Property<double>("MaxTextBoxHeight")
                        .HasColumnType("float");

                    b.Property<double>("MaxTextBoxWidth")
                        .HasColumnType("float");

                    b.Property<bool>("ShowArt")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowAttack")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowDefense")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowDiscipline")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowFaction")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowGoldCost")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowInfo")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowLoyalty")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowName")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowText")
                        .HasColumnType("bit");

                    b.Property<bool>("ShowType")
                        .HasColumnType("bit");

                    b.HasKey("TemplateInfoId");

                    b.HasIndex("CreatorId");

                    b.HasIndex("LastModifiedById");

                    b.ToTable("TemplateInfoModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.UserModel", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreateTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("Guid")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("LastLoginTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("Token")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserModels");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.CardModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.FactionModel", "Faction")
                        .WithMany()
                        .HasForeignKey("FactionId");

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.RuleSetModel", "RuleSet")
                        .WithMany()
                        .HasForeignKey("RuleSetId");

                    b.HasOne("Arcmage.DAL.Model.SerieModel", "Serie")
                        .WithMany("Cards")
                        .HasForeignKey("SerieId");

                    b.HasOne("Arcmage.DAL.Model.StatusModel", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId");

                    b.HasOne("Arcmage.DAL.Model.CardTypeModel", "Type")
                        .WithMany()
                        .HasForeignKey("TypeCardTypeId");

                    b.HasOne("Arcmage.DAL.Model.UserModel", null)
                        .WithMany("Cards")
                        .HasForeignKey("UserModelUserId");

                    b.Navigation("Creator");

                    b.Navigation("Faction");

                    b.Navigation("LastModifiedBy");

                    b.Navigation("RuleSet");

                    b.Navigation("Serie");

                    b.Navigation("Status");

                    b.Navigation("Type");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.CardTypeModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.TemplateInfoModel", "TemplateInfo")
                        .WithMany()
                        .HasForeignKey("TemplateInfoId");

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");

                    b.Navigation("TemplateInfo");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.DeckCardModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.CardModel", "Card")
                        .WithMany()
                        .HasForeignKey("CardId");

                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.DeckModel", "Deck")
                        .WithMany("DeckCards")
                        .HasForeignKey("DeckId");

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Card");

                    b.Navigation("Creator");

                    b.Navigation("Deck");

                    b.Navigation("LastModifiedBy");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.DeckModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.StatusModel", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId");

                    b.HasOne("Arcmage.DAL.Model.UserModel", null)
                        .WithMany("Decks")
                        .HasForeignKey("UserModelUserId");

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.FactionModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.RoleModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.RuleSetModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.StatusModel", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId");

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.SerieModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.StatusModel", "Status")
                        .WithMany()
                        .HasForeignKey("StatusId");

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.StatusModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.TemplateInfoModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.UserModel", "Creator")
                        .WithMany()
                        .HasForeignKey("CreatorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Arcmage.DAL.Model.UserModel", "LastModifiedBy")
                        .WithMany()
                        .HasForeignKey("LastModifiedById")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Creator");

                    b.Navigation("LastModifiedBy");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.UserModel", b =>
                {
                    b.HasOne("Arcmage.DAL.Model.RoleModel", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.DeckModel", b =>
                {
                    b.Navigation("DeckCards");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.SerieModel", b =>
                {
                    b.Navigation("Cards");
                });

            modelBuilder.Entity("Arcmage.DAL.Model.UserModel", b =>
                {
                    b.Navigation("Cards");

                    b.Navigation("Decks");
                });
#pragma warning restore 612, 618
        }
    }
}
