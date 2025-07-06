from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from faker import Faker
from blog.models import Team


class Command(BaseCommand):
    help = 'Generates dummy teams'

    def handle(self, *args, **kwargs):
        fake_en = Faker('en_US')
        fake_fa = Faker('fa_IR')

        teams_data = [
            {'en': 'Dragons', 'fa': 'اژدهایان'},
            {'en': 'Wizards', 'fa': 'جادوگران'},
            {'en': 'Giants', 'fa': 'غول‌ها'},
            {'en': 'Lions', 'fa': 'شیرها'},
            {'en': 'Sharks', 'fa': 'کوسه‌ها'},
        ]
        
        self.stdout.write(self.style.SUCCESS('Generating 5 teams...'))

        for team_data in teams_data:
            team = Team()
            
            # Set translations
            team.set_current_language('en')
            team.name = team_data['en']
            
            team.set_current_language('fa')
            team.name = team_data['fa']
            
            # Handle image
            dummy_content = b'dummy image data'
            image_file = ContentFile(dummy_content, name=f'{slugify(team_data["en"])}.jpg')
            team.image.save(image_file.name, image_file, save=False)

            team.save()
            
            self.stdout.write(self.style.SUCCESS(f'Successfully created team: {team_data["en"]} / {team_data["fa"]}'))
        
        self.stdout.write(self.style.SUCCESS('Finished generating teams.')) 