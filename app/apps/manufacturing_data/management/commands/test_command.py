from django.core.management.base import BaseCommand, CommandError
from manufacturing_data.models import *

class Command(BaseCommand):

  """ Main """
  def handle(self, *args, **options):
    for man_hour in ManHour.objects.all():
      print(man_hour.id,"\t", end="")
      print(man_hour.work_hour,"\t", end="")
      print(man_hour.date)
