## Data Types and Categorization

The AED contains both spatial and non-spatial (attribute) data, managed using GIS software and a relational database management system. Spatial and relational data are both maintained in a PostgreSQL database with the PostGIS extension. These data sets are combined with base map data derived from the Digital Chart of the World (ESRI, Inc., 1992) a widely available global geographical dataset, the World Database of Protected Areas, the World Resource Institute’s protected area data set and a variety of other sources. Each of these background datasets is used as appropriate within the AED online platform and none are considered authoritative datasets produced by the AfESG.

Data in a variety of formats are collected and received into the AED. Survey reports are obtained from wildlife management agencies and other organizations, and non survey-report data are shared in many formats by individuals and organizations with expert knowledge of an area. Preliminary range maps are shared with relevant experts to aid in modifying and revising.

Data regarding an estimate or a guess are entered into the database using a submission form specific to the type of survey. Every estimate or guess is linked to spatial data, which is digitized and geo-referenced if not supplied by the data provider. Each submission consists of spatial data accompanied by appropriate attribute data manually extracted from the source material, such as transect length, flight speed, or dung decay rate. The source material (survey report, map, email, etc.) is then uploaded and linked to the submission.

Area measurements in the tables are calculated using geodetic coordinates on the WGS84 spheroid, for consistency across the African continent without projection-related errors. The surface areas of input zones, protected areas and elephant range are tallied at national, regional and continental levels. The overlay capabilities of GIS are used to determine percentages of both protected and surveyed elephant range.

The AED stores data on two basic variables reflecting the conservation status of African elephants, namely, numbers (abundance) and distribution (range). There are specific challenges associated with these kinds of data, related to their reliability and the availability and timing of new surveys. The ways that these issues are handled are described in the following sections.

### Elephant Numbers

Although there are many different ways to count elephants, no single method is perfect. Possible sources of bias include the choice of survey technique, surveyor skill, quality and availability of adequate equipment, financial constraints, climatic conditions and vegetation cover. Ideally, data on elephants in any country should be collected by a wildlife management authority using qualified staff and standardized methods for collecting, recording and analysing data (Craig, 2012c; Hedges & Lawson, 2006). In reality very few countries have the means, either financial or in the form of expertise, to conduct systematic surveys on a regular basis and political strife in many range states sometimes makes survey work impossible.

As a result, elephant population data is collected by a variety of agencies and individuals, often without any direct linkage to one another and using a variety of different techniques. It is sometimes necessary to combine data from different types of surveys and different habitats to calculate a national estimate. Seasonal and cross-border movements of elephants are additional factors that can lead to inaccurate national estimates. Few cross-border surveys are conducted simultaneously to accurately estimate the size of such populations. Instead, they are generally treated as separate populations on either side of the border, which may occasionally result in either under- or over-counting. The end result is a collection of data of variable quality for most countries, and no data from formal surveys for many populations.

### Methods of Estimating Elephant Numbers

While there is no single or ideal method for counting elephants, each method has its advantages and disadvantages under different conditions. The brief description of some of the most important methods below is not intended to be detailed or exhaustive. For more details, the reader is referred to the specialized treatments of these subjects (Barnes, 1993; Craig, 1993, 2004, 2012c; Douglas-Hamilton, 1996; Hedges et al., 2013; Hedges & Lawson, 2006; Kangwana, 1996; Norton-Griffiths, 1978).

Methods for establishing elephant numbers fall into three broad categories: estimates from total counts, estimates from sample counts, and guesses.

**Total Counts** aim to see and record all the elephants in a defined area, either from the air or from the ground. Aerial total counts are conducted from fixed-wing aircraft or helicopters. The speed at which the aircraft is flown influences the accuracy of the count, with high speeds usually leading to undercounts (Norton-Griffiths, 1978). Aerial total counts are commonly used in open, savanna habitats, where elephants are unlikely to be hidden by forest or thick bush, especially but not exclusively in Eastern and Southern Africa.

Total counts of a limited area can also be conducted at ground level by teams in vehicles or on foot. These are uncommon in Africa, but in a handful of places, total ground counts have been accomplished by attempting to identify every individual in the population. This is only possible for intensively studied populations where animals can be observed readily. For such individual recognition studies to provide high quality data for the AED, every individual in the population must be registered. Many ongoing studies have so far covered only a fraction of these focal populations, and cannot therefore provide reliable estimates of entire populations. If elephants are being identified in a place where they concentrate for a specific resource (such as the Amboseli swamps in Kenya and Dzanga Bai in the Central African Republic), it may be difficult to work out how large an area is covered by the identified elephants, and the estimate will be affected by the timescale over which elephants have been enumerated (if too short it will not include occasionally seen individuals, if too long it may include ones that have already died).

**Sample Counts**, in which only a sample of the area is counted (usually between 3% and 20%), are generally conducted along transects which may be randomly distributed or systematically placed across the study area. The resulting data are used to calculate a population estimate with confidence limits. In contrast with total counts, which tend to produce underestimates of the true population, sample counts have in principle an equal chance of underestimating or overestimating the true population, provided that sampling error is the main source of error. In practice, however, factors such as high aircraft speed or dense vegetation cover lead to undercounts.

**Direct Sample Counts** are most commonly made from the air, but may also be conducted on the ground, either on foot or from vehicles. Aerial sample counts require considerable technical expertise and coordination, as well as the use of expensive additional equipment such as radar altimeters. Aerial sample counts are the most commonly employed survey technique in Eastern and Southern Africa.

**Indirect Sample Counts** are also referred to as dung counts. In low-visibility tropical forests, elephant abundance estimates typically use elephant dung density as a proxy for elephant density. Distance sampling (Buckland et al., 2001, 2015) along line transects estimates dung density and CLs within the area of interest (Hedges, 2012a; Strindberg, 2012). DISTANCE software (Thomas et al., 2010) is used for both survey design and analysis. Careful field protocol ensures accurate and precise estimates (Hedges et al., 2012a; Hedges & Lawson, 2006). Dung density is converted to elephant abundance using estimates of the rates of elephant defecation and dung decay and the surface area of the area surveyed. Dung decay rates can vary considerably across space and time: site and time-specific estimates of decay rates greatly improve accuracy in elephant abundance estimates (Hedges et al., 2012b; Laing et al., 2003). Estimates from well-conducted dung counts can be as accurate as those from direct methods, and more precise than those of aerial sample counts (Barnes, 2001, 2002). At sites < 5,000km² and where elephant numbers are between a few tens and a few thousand, DNA-based capture-recapture methods have been used (Eggert et al., 2003; Gray et al., 2014; Hedges, 2012b; Hedges et al., 2013; Karanth et al., 2012b; Karanth et al., 2012c). Elephant DNA is extracted from as many dung piles as possible within the area of interest, and genetic fingerprinting is used to identify the number of unique genotypes (individuals) in the samples. The rates of repeat samples obtained can then be used to estimate the population size (Karanth et al., 2012a).

Often, it is not possible to carry out a systematic survey and the only type of information available for many areas is either an informed or other guess.

#### Survey Reliability

Population estimate data entered into the AED varies in quality from the identification of individual animals to plain guesswork. The addition of population numbers of varying quality into national, regional and continental totals is, from a statistical viewpoint, invalid and produces misleading results. On the other hand, discarding low-quality numbers can produce equally misleading estimates, as high-quality survey estimates are not available for many areas in which elephants are found.

In order to solve this problem, the AED incorporates a system to accommodate all types of numbers by classifying them according to their type and designating them as estimates and guesses.

As with the previous data aggregation system, which separated numbers into Definite, Probable, Possible, and Speculative, the new ADD system uses a scale of survey reliability, ranging from A (highest) to E (lowest). Survey reliability gives an indication of the level of certainty that can be placed on a given number, as determined by the method employed and how it was carried out.

Tables 1 and 2 show the different types of surveys with the range of reliabilities that could be assigned to them and how each number contributes to the columns of estimates and guesses depending on its reliability and other criteria. How the columns are then summed to create country, regional, and continental totals is detailed in the next section, “Integration and Presentation of Data.”

The unit of analysis for assigning these categories is the “input zone” and these are listed in each country table. An input zone has only one source of information and may align with a protected area or other land unit, or simply with an area for which there was previous information, better enabling comparison to previous AESRs. Each input zone is assigned a reliability category, and the figure associated with that input zone contributes to the estimates and guesses as shown in Table 2.

![Table 1][table1]

_* The AfESG’s Data Review Working Group (DRWG) reviews all surveys to ensure that key standards have been met and parameters included in the report to allow determination of the quality of survey design and implementation. The AfESG and its DRWG make every e ort to engage with data providers to secure any essential missing information_

![Table 2][table2]

_* These survey types may be downgraded to lower reliabilities and thus treated as informed or other guesses. See the criteria in Table 1._

#### Carcass Ratios
The carcass ratio, a measure often calculated in aerial total and sample counts, is the estimated number of dead elephants divided by the sum of estimated dead plus live elephants. Carcass ratios can provide supporting information to changes in numbers in successive surveys and thus are included in the narrative text alongside survey estimates where available and appropriate. Douglas-Hamilton and Burrill (1991) showed that carcass ratios in excess of 8% for sample counts or 3.3% for total counts were indicative of declining populations.

### Elephant Distribution

African elephants occur in a wide variety of habitats, from tropical swamp forests to deserts. They often move extensively in search of food, water and minerals or in response to disturbance, and the extent to which they move may depend on a large number of factors. In certain areas, seasonal movements are predictable, while in others, movement patterns are far more difficult to decipher. These factors, together with the scarcity of animals at the edges of their distribution, make elephant range a difficult concept to articulate and map. For these reasons, elephant range is broadly defined by the AfESG as the entire area where the species occurs in the wild at any time.

Collecting precise distribution information on such a wide-ranging species as the African elephant presents a number of practical problems, often related to the inaccessibility of some of the habitats in which elephants are found. As a result, the quality of information varies considerably from one area to another and its mapping heavily relies on expert opinion. The range map for a particular country is often updated by a single individual, and thus has a subjective element. Trying to draw a precise range boundary on maps of varying quality and scale is an inexact exercise. Neat, rounded lines may be indicative of scanty knowledge in comparison to the fragmented, more detailed pictures which emerge from countries where more precise information is available. Elephant range often appears to coincide directly with the boundaries of protected areas, because that is where most population surveys are carried out, and elephant movements in and out of protected areas are often unknown or unaccounted for.

Frequently, the depiction of range is also delimited by a natural boundary such as a river or a mountain range for convenience rather than accuracy. When range information in one country extends to a national border, it does not always match the adjacent range in the neighbouring country. While this is sometimes due to different human population densities or land uses across a border, more often lack of reliable information is the cause of what appear to be hard boundaries.

In order to address some of these difficulties, the AED classifies and maps elephant range information into four levels of certainty, as described in Table 3. 

** TABLE 3. CODES & DESCRIPTIONS OF REASONS FOR CHANGE AS IMPLEMENTED IN THE AED**
!['Table 3'][table3]

[table1]: /images/table1.png
[table2]: /images/table2.png
[table3]: /images/table3.png
