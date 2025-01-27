import { Base } from "./base";
import { CardType } from "./card-type";
import { Faction } from "./faction";
import { Status } from "./status";
import { RuleSet } from "./rule-set";
import { Serie } from "./serie";
import { Language } from "./language";
import { License } from "./license";

export class Card extends Base {
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    artist: string;
    ruleText: string;
    flavorText: string;
    subType: string;
    type: CardType;
    faction: Faction;
    status: Status;
    cost: string;
    loyalty: number;
    attack: string;
    defense: string;
    info: string;
    serie: Serie;
    ruleSet: RuleSet;
    artwork: string;
    artworkLicensor: string;
    artworkLicense: License;
    layoutText: string;
    markdownText: string;
    svg: string;
    png: string;
    jpeg: string;
    pdf: string;
    backSvg: string;
    backPng: string;
    backJpeg: string;
    backPdf: string;
    isGenerated: boolean;
    backgroundPng: string;
    overlaySvg: string;
    language: Language;
}