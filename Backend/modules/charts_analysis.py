import spacy
import random

nlp = spacy.load("en_core_web_sm")


class Analysis:
    def __init__(self):
        """
        Initialize objects and class variables
        """
        self.CATEGORIES = ['security', 'service', 'hotel', 'staff', 'chef', 'food', 'guest', 'stay', 'breakfast', 'foods', 'buffet', 'location', 'furniture', 'comfort', 'reception']
        self.SENTIMENT_LEXICON = {
            'good': 1,
            'great': 2,
            'excellent': 2,
            'amazing': 2,
            'clean': 1,
            'spacious': 1,
            'comfortable': 1,
            'enjoyed': 2,
            'delightful': 2,
            'surprising': 1,
            'thankful': 1,
            'thank': 1,
            'loved': 2,
            'caring': 2,
            'friendly': 1,
            'bad': -1,
            'poor': -2,
            'dirty': -2,
            'slow': -1,
            'terrible': -2,
            'not': -0.5
        }
    
    def get_category_sentiment(self, text):
        doc = nlp(text)
        results = {}

        for sent in doc.sents:
            for token in sent:
                if token.text.lower() in self.CATEGORIES:
                    aspect = token.text.lower()
                    sentiment_score = 0

                    for word in sent:
                        w = word.text.lower()
                        if w in self.SENTIMENT_LEXICON:
                            sentiment_score += self.SENTIMENT_LEXICON[w]
                        elif word.dep_ == 'neg':
                            sentiment_score -= 1


                    sentiment = (
                        'positive' if sentiment_score > 0 else
                        'negative' if sentiment_score < 0 else
                        'neutral'
                    )

                    if aspect not in results:
                        results[aspect] = []
                    results[aspect].append((sent.text.strip(), sentiment_score, sentiment))

        return results
    
    def get_analysis(self, reviews):
        sentiments = {
            'positive':0,
            'negative':0,
            'neutral':0
        }
        aspects = {} #a dictionary of dictionaries
        review_sentiments = {} #This is for the sentiments of each component of the review ('staff', 'food', etc. etc.)
        review_aspects = {}
        review_reaction = {} #This is for the sentiment of the review ('Positive', 'Negative', or 'Neutral')

        for review in reviews:
            output = self.get_category_sentiment(review)

            if not review_sentiments.__contains__(review):
                review_sentiments.update({review:{'positive':0, 'negative':0, 'neutral':0}})

            if not review_aspects.__contains__(review):
                review_aspects.update({review:{}})

            if not review_reaction.__contains__(review):
                review_reaction.update({review:{'review':review, 'sentiment':''}})
        
            review_score = 0
            for key in output.keys():
                for items in output[key]:
                    aspect = key
                    score = items[1]
                    sentiment = items[2]

                    review_score += score

                    if not aspects.__contains__(aspect):
                        aspects.update({aspect:{'score':0, 'frequency':0, 'average':0.0}})

                    if not review_aspects[review].__contains__(aspect):
                        review_aspects[review].update({aspect:{'score':0, 'frequency':0, 'average':0.0}})

                    this_aspect = aspects[aspect]
                    this_review_aspect = review_aspects[review][aspect]

                    this_aspect['score'] += score
                    this_aspect['frequency'] += 1
                    this_aspect['average'] = round(this_aspect.get('score') / this_aspect.get('frequency'), 2)

                    this_review_aspect['score'] += score
                    this_review_aspect['frequency'] += 1
                    this_review_aspect['average'] = round(this_review_aspect.get('score') / this_review_aspect.get('frequency'), 2)

                    sentiments[sentiment] += 1
                    review_sentiments[review][sentiment] += 1

            review_reaction[review]['sentiment'] = (
                'Positive' if review_score > 0 
                else 'Negative' if review_score < 0 
                else 'Neutral'
            )
        
        for key in review_sentiments.keys():
            this_key = review_sentiments[key]

            total_sum = sum(this_key[key] for key in ['positive', 'negative', 'neutral'])
            major = max(this_key, key=this_key.get)

            this_key.update({'total':total_sum, 'major': major})
        
        mSum = sum(sentiments[key] for key in ['positive', 'negative', 'neutral'])
        major = max(sentiments, key=sentiments.get)

        sentiments.update({'total':mSum, 'major':major})

        #overall here refers to the analysis done on all the reviews
        #data with review prefix refers to the analysis done on individual reviews
        #overall_sentiments for now do not contain any aspect specific data
        return { 'overall_sentiments':sentiments, 'overall_aspects':aspects, 'review_sentiments':review_sentiments, 'review_aspects':review_aspects, 'review_reactions': review_reaction }
    
    def format_analysis(self, reviews):
        review_texts = list(map(lambda r: r['text'], reviews))
        analysis = self.get_analysis(review_texts)

        overall_sentiments = analysis['overall_sentiments']
        overall_aspects = analysis['overall_aspects']

        #  Step 1: Gather raw scores for normalization
        aspect_values = [a['average'] for a in overall_aspects.values()]
        min_val = min(aspect_values) if aspect_values else 0
        max_val = max(aspect_values) if aspect_values else 1

        def normalize_score(val, min_val, max_val):
            min_spread = 1.0  # Prevent division by near-zero
            spread = max(max_val - min_val, min_spread)
            scaled = 0.5 + ((val - min_val) * (4.5 / spread))
            return round(min(max(scaled, 0.5), 5.0), 2)

        #  Step 2: Format aspects
        formatted_aspects = []
        formatted_aspects_options = []

        for aspect in overall_aspects:
            label = aspect
            values = overall_aspects[aspect]

            formatted_aspect = {
                'label': self.capitalize(label),
                'value': normalize_score(values['average'], min_val, max_val),
                'color': self.random_hex_color()
            }

            formatted_aspect_option = {
                'id': label,
                'label': self.capitalize(label),
                'selected': False
            }

            formatted_aspects_options.append(formatted_aspect_option)
            formatted_aspects.append(formatted_aspect)

        # Step 3: Format overall sentiments
        formatted_sentiments = {
            'Overall': [
                { 'label': 'Positive', 'value': overall_sentiments['positive'], 'color': '#10B981' },
                { 'label': 'Neutral',  'value': overall_sentiments['neutral'],  'color': '#6B7280' },
                { 'label': 'Negative', 'value': overall_sentiments['negative'], 'color': '#EF4444' }
            ]
        }

        sentiment_labels = [
            { 'id': 'Overall', 'label': 'Overall', 'selected': True }
        ]

        # Step 4: Format individual review reactions
        formatted_reactions = []

        for reaction in analysis['review_reactions']:
            try:
                matching_review = next((r for r in reviews if r['text'] == reaction), None)
                curr_analysis = analysis['review_reactions'][reaction]

                reviewer_name = matching_review['author']
                rating = matching_review['rating']
                source = matching_review['platform']
                createdAt = matching_review['creationDate']
                review = reaction
                sentiment = curr_analysis['sentiment']

                formatted_review_reaction = {
                    'id': self.generate_numeric_id(),
                    'reviewerName': reviewer_name,
                    'rating': rating,
                    'review': review,
                    'source': source,
                    'createdAt': createdAt,
                    'sentiment': sentiment
                }

                formatted_reactions.append(formatted_review_reaction)

            except Exception as e:
                print(str(e))

        return {
            'guestExperienceData': formatted_aspects,
            'guestExperienceOptions': formatted_aspects_options,
            'trajectoryData': [],
            'trajectoryOptions': [],
            'sentimentsData': formatted_sentiments,
            'sentimentsOptions': sentiment_labels,
            'reviewReactions': formatted_reactions
        }

    def random_hex_color(self):
        return "#{:06x}".format(random.randint(0, 0xFFFFFF)).upper()
    
    def capitalize(self, s):
        return s[0].upper() + s[1:]
    
    def generate_numeric_id(self, length=6):
        if length < 1:
            raise ValueError("Length must be at least 1")
        lower_bound = 10**(length - 1)
        upper_bound = 10**length - 1
        return random.randint(lower_bound, upper_bound)